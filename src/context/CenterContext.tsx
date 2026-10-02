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
    assistantName = 'Assistant'
  ) => {
    const center = centers.find(c => c.id === centerId);
    if (!center) return;

    const newDist: InventoryDistribution = {
      id: 'dist-' + Math.floor(1000 + Math.random() * 9000),
      center_id: centerId,
      center_name: center.name,
      assistant_id: 'ast-current',
      assistant_name: assistantName,
      books_count: Number(booksCount),
      codes_count: Number(codesCount),
      notes: notes?.trim(),
      distribution_date: date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    setDistributions(prev => [newDist, ...prev]);
    showToast(`Successfully logged delivery: ${booksCount} Books & ${codesCount} Codes for ${center.name}`, 'success');
  };

  const addCollection = (
    centerId: string,
    paymentMethod: PaymentMethod,
    receiptProofUrl: string | null,
    notes?: string,
    date?: string,
    assistantName = 'Assistant',
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
      collection_date: date || new Date().toISOString().split('T')[0],
      status: paymentMethod === 'cash' ? 'verified' : 'pending_verification',
      created_at: new Date().toISOString(),
    };

    setCollections(prev => [newCol, ...prev]);
    showToast(`Payment collection logged for ${center.name} (${category.toUpperCase()} revenue)`, 'success');
  };

  const addCenter = (newCenterData: Omit<EducationalCenter, 'id' | 'created_at'>) => {
    const newCenter: EducationalCenter = {
      ...newCenterData,
      id: 'cnt-' + Math.floor(1000 + Math.random() * 9000),
      created_at: new Date().toISOString(),
    };
    setCenters(prev => [...prev, newCenter]);
    showToast(`New center "${newCenter.name}" added successfully.`, 'success');
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
  };

  const verifyCollection = (collectionId: string, status: 'verified' | 'rejected') => {
    setCollections(prev =>
      prev.map(c => (c.id === collectionId ? { ...c, status } : c))
    );
    showToast(`Collection marked as ${status.replace('_', ' ')}.`, status === 'verified' ? 'success' : 'info');
  };

  const deleteDistribution = (id: string) => {
    setDistributions(prev => prev.filter(d => d.id !== id));
    showToast('Distribution record removed.', 'info');
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    showToast('Collection record removed.', 'info');
  };

  const deleteCenter = (id: string) => {
    setCenters(prev => prev.filter(c => c.id !== id));
    setDistributions(prev => prev.filter(d => d.center_id !== id));
    setCollections(prev => prev.filter(c => c.center_id !== id));
    showToast('Center and associated history deleted.', 'info');
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
