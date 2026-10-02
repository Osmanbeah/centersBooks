import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { 
  EducationalCenter, 
  InventoryDistribution, 
  PaymentCollection, 
  CenterFinancialSummary, 
  GlobalFinancialKPIs,
  PaymentMethod,
  CollectionCategory
} from '../types';
import { INITIAL_CENTERS, INITIAL_DISTRIBUTIONS, INITIAL_COLLECTIONS } from '../lib/mockData';
import { supabase, isSupabaseLiveConfigured } from '../lib/supabase';
import { useToast } from './ToastContext';

interface CenterContextType {
  centers: EducationalCenter[];
  distributions: InventoryDistribution[];
  collections: PaymentCollection[];
  financialSummaries: CenterFinancialSummary[];
  globalKPIs: GlobalFinancialKPIs;
  addDistribution: (
    centerId: string,
    booksCount: number,
    codesCount: number,
    notes?: string,
    date?: string,
    assistantName?: string
  ) => void;
  addCollection: (
    centerId: string,
    paymentMethod: PaymentMethod,
    receiptProofUrl: string | null,
    notes?: string,
    date?: string,
    assistantName?: string,
    amount?: number,
    category?: CollectionCategory,
    booksPortion?: number,
    codesPortion?: number
  ) => void;
  addCenter: (newCenter: Omit<EducationalCenter, 'id' | 'created_at'>) => void;
  updateCenterPricing: (
    centerId: string,
    bookPrice: number,
    bookCenterCut: number,
    codePrice: number,
    codeCenterCut: number
  ) => void;
  verifyCollection: (collectionId: string, status: 'verified' | 'rejected') => void;
  deleteDistribution: (id: string) => void;
  deleteCollection: (id: string) => void;
  deleteCenter: (id: string) => void;
}

const CenterContext = createContext<CenterContextType | undefined>(undefined);

export const CenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [centers, setCenters] = useState<EducationalCenter[]>(() => {
    const saved = localStorage.getItem('app_centers');
    return saved ? JSON.parse(saved) : INITIAL_CENTERS;
  });

  const [distributions, setDistributions] = useState<InventoryDistribution[]>(() => {
    const saved = localStorage.getItem('app_distributions');
    return saved ? JSON.parse(saved) : INITIAL_DISTRIBUTIONS;
  });

  const [collections, setCollections] = useState<PaymentCollection[]>(() => {
    const saved = localStorage.getItem('app_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  useEffect(() => {
    localStorage.setItem('app_centers', JSON.stringify(centers));
  }, [centers]);

  useEffect(() => {
    localStorage.setItem('app_distributions', JSON.stringify(distributions));
  }, [distributions]);

  useEffect(() => {
    localStorage.setItem('app_collections', JSON.stringify(collections));
  }, [collections]);

  // Load from Supabase on mount if configured
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!isSupabaseLiveConfigured()) return;
      try {
        const [cRes, dRes, colRes] = await Promise.all([
          supabase.from('educational_centers').select('*').order('created_at', { ascending: false }),
          supabase.from('inventory_distributions').select('*').order('created_at', { ascending: false }),
          supabase.from('payment_collections').select('*').order('created_at', { ascending: false }),
        ]);

        if (cRes.data && cRes.data.length > 0) setCenters(cRes.data as EducationalCenter[]);
        if (dRes.data && dRes.data.length > 0) setDistributions(dRes.data as InventoryDistribution[]);
        if (colRes.data && colRes.data.length > 0) setCollections(colRes.data as PaymentCollection[]);
      } catch (err) {
        console.error('Supabase fetch failed, fallback to local cache:', err);
      }
    };
    loadFromSupabase();
  }, []);

  // Compute separated financial breakdown per center
  const financialSummaries: CenterFinancialSummary[] = useMemo(() => {
    return centers.map(center => {
      // All distributions for this center
      const centerDrops = distributions.filter(d => d.center_id === center.id);
      const totalBooks = centerDrops.reduce((sum, d) => sum + d.books_count, 0);
      const totalCodes = centerDrops.reduce((sum, d) => sum + d.codes_count, 0);

      // Books Calculations
      const grossBooksRevenue = totalBooks * center.book_price;
      const booksCenterCut = totalBooks * center.book_center_cut;
      const booksOwnerNetDue = grossBooksRevenue - booksCenterCut;

      // Codes Calculations
      const grossCodesRevenue = totalCodes * center.code_price;
      const codesCenterCut = totalCodes * center.code_center_cut;
      const codesOwnerNetDue = grossCodesRevenue - codesCenterCut;

      // Combined Revenue Calculations
      const grossTotalRevenue = grossBooksRevenue + grossCodesRevenue;
      const centerTotalCut = booksCenterCut + codesCenterCut;
      const ownerNetDue = booksOwnerNetDue + codesOwnerNetDue;

      // Filter non-rejected collections for this center
      const centerCollections = collections.filter(c => c.center_id === center.id && c.status !== 'rejected');
      
      let booksCollected = 0;
      let codesCollected = 0;

      centerCollections.forEach(c => {
        const totalCol = c.amount_collected || 0;
        if (c.category === 'books') {
          booksCollected += totalCol;
        } else if (c.category === 'codes') {
          codesCollected += totalCol;
        } else if (c.category === 'both') {
          if (c.books_portion !== undefined && c.codes_portion !== undefined) {
            booksCollected += c.books_portion;
            codesCollected += c.codes_portion;
          } else {
            // fallback: distribute based on net due proportions
            if (ownerNetDue > 0) {
              const bookRatio = booksOwnerNetDue / ownerNetDue;
              booksCollected += totalCol * bookRatio;
              codesCollected += totalCol * (1 - bookRatio);
            } else {
              booksCollected += totalCol / 2;
              codesCollected += totalCol / 2;
            }
          }
        } else {
          // Legacy without category: attribute to books first, then codes
          booksCollected += totalCol;
        }
      });

      const booksOutstanding = Math.max(0, booksOwnerNetDue - booksCollected);
      const codesOutstanding = Math.max(0, codesOwnerNetDue - codesCollected);
      const totalCollected = booksCollected + codesCollected;
      const totalOutstanding = booksOutstanding + codesOutstanding;

      return {
        center,
        // Books Breakdown
        total_books_delivered: totalBooks,
        gross_books_revenue: grossBooksRevenue,
        books_center_cut: booksCenterCut,
        books_owner_net_due: booksOwnerNetDue,
        books_collected: booksCollected,
        books_outstanding_balance: booksOutstanding,

        // Codes Breakdown
        total_codes_delivered: totalCodes,
        gross_codes_revenue: grossCodesRevenue,
        codes_center_cut: codesCenterCut,
        codes_owner_net_due: codesOwnerNetDue,
        codes_collected: codesCollected,
        codes_outstanding_balance: codesOutstanding,

        // Overall Totals
        gross_total_revenue: grossTotalRevenue,
        center_total_cut: centerTotalCut,
        owner_net_due: ownerNetDue,
        total_collected: totalCollected,
        outstanding_balance: totalOutstanding,
      };
    });
  }, [centers, distributions, collections]);

  // Global KPIs across all centers
  const globalKPIs: GlobalFinancialKPIs = useMemo(() => {
    let totalBooks = 0;
    let totalCodes = 0;
    
    let totalBooksGross = 0;
    let totalBooksCut = 0;
    let totalBooksNet = 0;
    let totalBooksCollected = 0;
    let totalBooksOutstanding = 0;

    let totalCodesGross = 0;
    let totalCodesCut = 0;
    let totalCodesNet = 0;
    let totalCodesCollected = 0;
    let totalCodesOutstanding = 0;

    let totalGross = 0;
    let totalCut = 0;
    let totalNet = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;

    financialSummaries.forEach(s => {
      totalBooks += s.total_books_delivered;
      totalCodes += s.total_codes_delivered;

      totalBooksGross += s.gross_books_revenue;
      totalBooksCut += s.books_center_cut;
      totalBooksNet += s.books_owner_net_due;
      totalBooksCollected += s.books_collected;
      totalBooksOutstanding += s.books_outstanding_balance;

      totalCodesGross += s.gross_codes_revenue;
      totalCodesCut += s.codes_center_cut;
      totalCodesNet += s.codes_owner_net_due;
      totalCodesCollected += s.codes_collected;
      totalCodesOutstanding += s.codes_outstanding_balance;

      totalGross += s.gross_total_revenue;
      totalCut += s.center_total_cut;
      totalNet += s.owner_net_due;
      totalCollected += s.total_collected;
      totalOutstanding += s.outstanding_balance;
    });

    const pendingProofs = collections.filter(c => c.status === 'pending_verification').length;

    return {
      totalCenters: centers.length,
      totalBooksDistributed: totalBooks,
      totalCodesDistributed: totalCodes,

      totalBooksGross,
      totalBooksCut,
      totalBooksNet,
      totalBooksCollected,
      totalBooksOutstanding,

      totalCodesGross,
      totalCodesCut,
      totalCodesNet,
      totalCodesCollected,
      totalCodesOutstanding,

      totalGrossSales: totalGross,
      totalCenterCommissions: totalCut,
      totalOwnerNetProfit: totalNet,
      totalCollected: totalCollected,
      totalOutstandingBalance: totalOutstanding,
      pendingProofVerifications: pendingProofs,
    };
  }, [centers, financialSummaries, collections]);

  // Actions
  const addDistribution = (
    centerId: string,
    booksCount: number,
    codesCount: number,
    notes?: string,
    date?: string,
    assistantName = 'Assistant Mohamed'
  ) => {
    const center = centers.find(c => c.id === centerId);
    if (!center) return;

    const distributionDate = date || new Date().toISOString().split('T')[0];

    const newDist: InventoryDistribution = {
      id: 'dist-' + Math.floor(1000 + Math.random() * 9000),
      center_id: centerId,
      center_name: center.name,
      assistant_id: 'ast-current',
      assistant_name: assistantName,
      books_count: Number(booksCount),
      codes_count: Number(codesCount),
      notes: notes?.trim(),
      distribution_date: distributionDate,
      created_at: new Date().toISOString(),
    };

    setDistributions(prev => [newDist, ...prev]);
    showToast(`Successfully logged delivery: ${booksCount} Books & ${codesCount} Codes for ${center.name}`, 'success');

    if (isSupabaseLiveConfigured()) {
      supabase.from('inventory_distributions').insert([{
        center_id: centerId,
        center_name: center.name,
        assistant_name: assistantName,
        books_count: Number(booksCount),
        codes_count: Number(codesCount),
        notes: notes?.trim() || null,
        distribution_date: distributionDate,
      }]).then(({ error }) => {
        if (error) console.error('Supabase distribution sync error:', error);
      });
    }
  };

  const addCollection = (
    centerId: string,
    paymentMethod: PaymentMethod,
    receiptProofUrl: string | null,
    notes?: string,
    date?: string,
    assistantName = 'Assistant Mohamed',
    amount?: number,
    category: CollectionCategory = 'both',
    booksPortion?: number,
    codesPortion?: number
  ) => {
    const center = centers.find(c => c.id === centerId);
    if (!center) return;

    const summary = financialSummaries.find(s => s.center.id === centerId);
    const calculatedAmount = amount !== undefined ? amount : (summary?.outstanding_balance || 0);

    let finalBooksPortion = booksPortion;
    let finalCodesPortion = codesPortion;

    if (category === 'books') {
      finalBooksPortion = calculatedAmount;
      finalCodesPortion = 0;
    } else if (category === 'codes') {
      finalBooksPortion = 0;
      finalCodesPortion = calculatedAmount;
    } else if (category === 'both' && finalBooksPortion === undefined && finalCodesPortion === undefined) {
      finalBooksPortion = calculatedAmount / 2;
      finalCodesPortion = calculatedAmount / 2;
    }

    const collectionDate = date || new Date().toISOString().split('T')[0];
    const initialStatus = paymentMethod === 'cash' ? 'verified' : 'pending_verification';

    const newCol: PaymentCollection = {
      id: 'col-' + Math.floor(1000 + Math.random() * 9000),
      center_id: centerId,
      center_name: center.name,
      assistant_id: 'ast-current',
      assistant_name: assistantName,
      amount_collected: calculatedAmount,
      category: category,
      books_portion: finalBooksPortion,
      codes_portion: finalCodesPortion,
      payment_method: paymentMethod,
      receipt_proof_url: receiptProofUrl,
      notes: notes?.trim(),
      collection_date: collectionDate,
      status: initialStatus,
      created_at: new Date().toISOString(),
    };

    setCollections(prev => [newCol, ...prev]);
    showToast(`Payment collection logged for ${center.name} (${category.toUpperCase()} revenue)`, 'success');

    if (isSupabaseLiveConfigured()) {
      supabase.from('payment_collections').insert([{
        center_id: centerId,
        center_name: center.name,
        assistant_name: assistantName,
        amount_collected: calculatedAmount,
        category: category,
        books_portion: finalBooksPortion,
        codes_portion: finalCodesPortion,
        payment_method: paymentMethod,
        receipt_proof_url: receiptProofUrl,
        notes: notes?.trim() || null,
        collection_date: collectionDate,
        status: initialStatus,
      }]).then(({ error }) => {
        if (error) console.error('Supabase collection sync error:', error);
      });
    }
  };

  const addCenter = (newCenterData: Omit<EducationalCenter, 'id' | 'created_at'>) => {
    const newCenter: EducationalCenter = {
      ...newCenterData,
      id: 'cnt-' + Math.floor(1000 + Math.random() * 9000),
      created_at: new Date().toISOString(),
    };
    setCenters(prev => [...prev, newCenter]);
    showToast(`New center "${newCenter.name}" added successfully.`, 'success');

    if (isSupabaseLiveConfigured()) {
      supabase.from('educational_centers').insert([newCenterData]).then(({ error }) => {
        if (error) console.error('Supabase add center error:', error);
      });
    }
  };

  const updateCenterPricing = (
    centerId: string,
    bookPrice: number,
    bookCenterCut: number,
    codePrice: number,
    codeCenterCut: number
  ) => {
    setCenters(prev =>
      prev.map(c => {
        if (c.id === centerId) {
          return {
            ...c,
            book_price: Number(bookPrice),
            book_center_cut: Number(bookCenterCut),
            code_price: Number(codePrice),
            code_center_cut: Number(codeCenterCut),
          };
        }
        return c;
      })
    );
    showToast('Center pricing and commission rates updated.', 'success');

    if (isSupabaseLiveConfigured()) {
      supabase.from('educational_centers').update({
        book_price: Number(bookPrice),
        book_center_cut: Number(bookCenterCut),
        code_price: Number(codePrice),
        code_center_cut: Number(codeCenterCut),
      }).eq('id', centerId).then(({ error }) => {
        if (error) console.error('Supabase update pricing error:', error);
      });
    }
  };

  const verifyCollection = (collectionId: string, status: 'verified' | 'rejected') => {
    setCollections(prev =>
      prev.map(c => (c.id === collectionId ? { ...c, status } : c))
    );
    showToast(`Collection marked as ${status.replace('_', ' ')}.`, status === 'verified' ? 'success' : 'info');

    if (isSupabaseLiveConfigured()) {
      supabase.from('payment_collections').update({ status }).eq('id', collectionId).then(({ error }) => {
        if (error) console.error('Supabase verify collection error:', error);
      });
    }
  };

  const deleteDistribution = (id: string) => {
    setDistributions(prev => prev.filter(d => d.id !== id));
    showToast('Distribution record removed.', 'info');

    if (isSupabaseLiveConfigured()) {
      supabase.from('inventory_distributions').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase delete distribution error:', error);
      });
    }
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    showToast('Collection record removed.', 'info');

    if (isSupabaseLiveConfigured()) {
      supabase.from('payment_collections').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase delete collection error:', error);
      });
    }
  };

  const deleteCenter = (id: string) => {
    setCenters(prev => prev.filter(c => c.id !== id));
    setDistributions(prev => prev.filter(d => d.center_id !== id));
    setCollections(prev => prev.filter(c => c.center_id !== id));
    showToast('Center and associated history deleted.', 'info');

    if (isSupabaseLiveConfigured()) {
      supabase.from('educational_centers').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase delete center error:', error);
      });
    }
  };

  return (
    <CenterContext.Provider
      value={{
        centers,
        distributions,
        collections,
        financialSummaries,
        globalKPIs,
        addDistribution,
        addCollection,
        addCenter,
        updateCenterPricing,
        verifyCollection,
        deleteDistribution,
        deleteCollection,
        deleteCenter,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
};

export const useCenters = (): CenterContextType => {
  const context = useContext(CenterContext);
  if (!context) {
    throw new Error('useCenters must be used within a CenterProvider');
  }
  return context;
};
