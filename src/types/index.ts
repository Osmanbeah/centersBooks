export interface EducationalCenter {
  id: string;
  name: string;
  governorate: string;
  city: string;
  contact_person: string;
  phone: string;
  book_price: number; // Student selling price (e.g. 400 EGP)
  book_center_cut: number; // Center's commission cut per book (e.g. 50 EGP)
  code_price: number; // Student selling price for access code (e.g. 250 EGP)
  code_center_cut: number; // Center's commission cut per code (e.g. 30 EGP)
  created_at: string;
}

export interface InventoryDistribution {
  id: string;
  center_id: string;
  center_name: string;
  assistant_id: string;
  assistant_name: string;
  books_count: number;
  codes_count: number;
  notes?: string;
  distribution_date: string;
  created_at: string;
}

export type PaymentMethod = 'cash' | 'instapay' | 'vodafone_cash';
export type CollectionCategory = 'books' | 'codes' | 'both';

export interface PaymentCollection {
  id: string;
  center_id: string;
  center_name: string;
  assistant_id: string;
  assistant_name: string;
  amount_collected: number;
  category: CollectionCategory; // 'books' | 'codes' | 'both'
  books_portion?: number;
  codes_portion?: number;
  payment_method: PaymentMethod;
  receipt_proof_url?: string | null;
  notes?: string;
  collection_date: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  created_at: string;
}

export interface CenterFinancialSummary {
  center: EducationalCenter;
  
  // Books Financial Breakdown
  total_books_delivered: number;
  gross_books_revenue: number;
  books_center_cut: number;
  books_owner_net_due: number;
  books_collected: number;
  books_outstanding_balance: number;

  // Codes Financial Breakdown
  total_codes_delivered: number;
  gross_codes_revenue: number;
  codes_center_cut: number;
  codes_owner_net_due: number;
  codes_collected: number;
  codes_outstanding_balance: number;

  // Combined Totals
  gross_total_revenue: number;
  center_total_cut: number;
  owner_net_due: number;
  total_collected: number;
  outstanding_balance: number;
}

export interface GlobalFinancialKPIs {
  totalCenters: number;
  totalBooksDistributed: number;
  totalCodesDistributed: number;

  // Books KPI
  totalBooksGross: number;
  totalBooksCut: number;
  totalBooksNet: number;
  totalBooksCollected: number;
  totalBooksOutstanding: number;

  // Codes KPI
  totalCodesGross: number;
  totalCodesCut: number;
  totalCodesNet: number;
  totalCodesCollected: number;
  totalCodesOutstanding: number;

  // Combined KPI
  totalGrossSales: number;
  totalCenterCommissions: number;
  totalOwnerNetProfit: number;
  totalCollected: number;
  totalOutstandingBalance: number;
  pendingProofVerifications: number;
}

export type UserRole = 'admin' | 'assistant';
