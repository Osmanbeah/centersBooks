-- ==============================================================================
-- EDUCATIONAL CENTERS: BOOK & CODE DISTRIBUTION & FINANCIAL SETTLEMENT SYSTEM
-- Complete Supabase PostgreSQL Schema, RLS Security Policies, Storage & Seeds
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Educational Centers Table
CREATE TABLE IF NOT EXISTS public.educational_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    governorate TEXT NOT NULL DEFAULT 'Cairo',
    city TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    book_price NUMERIC(10, 2) NOT NULL DEFAULT 400.00,       -- Selling price to students
    book_center_cut NUMERIC(10, 2) NOT NULL DEFAULT 50.00,   -- Center commission cut per book
    code_price NUMERIC(10, 2) NOT NULL DEFAULT 250.00,       -- Selling price for activation code
    code_center_cut NUMERIC(10, 2) NOT NULL DEFAULT 30.00,   -- Center commission cut per code
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Inventory Distributions (Books & Codes Handed to Centers by Assistants)
CREATE TABLE IF NOT EXISTS public.inventory_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID NOT NULL REFERENCES public.educational_centers(id) ON DELETE CASCADE,
    center_name TEXT NOT NULL,
    assistant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assistant_name TEXT NOT NULL DEFAULT 'Assistant Mohamed',
    books_count INTEGER NOT NULL DEFAULT 0 CHECK (books_count >= 0),
    codes_count INTEGER NOT NULL DEFAULT 0 CHECK (codes_count >= 0),
    notes TEXT,
    distribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Payment Collections Table (Monthly Settlements / Cash / InstaPay / Vodafone Cash)
CREATE TABLE IF NOT EXISTS public.payment_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID NOT NULL REFERENCES public.educational_centers(id) ON DELETE CASCADE,
    center_name TEXT NOT NULL,
    assistant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assistant_name TEXT NOT NULL DEFAULT 'Assistant Mohamed',
    amount_collected NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    category TEXT NOT NULL DEFAULT 'both' CHECK (category IN ('books', 'codes', 'both')),
    books_portion NUMERIC(10, 2) DEFAULT 0.00,
    codes_portion NUMERIC(10, 2) DEFAULT 0.00,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'instapay', 'vodafone_cash')),
    receipt_proof_url TEXT, -- Base64 Data URL or Supabase Storage URL
    notes TEXT,
    collection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_center ON public.inventory_distributions(center_id);
CREATE INDEX IF NOT EXISTS idx_inventory_date ON public.inventory_distributions(distribution_date);
CREATE INDEX IF NOT EXISTS idx_payments_center ON public.payment_collections(center_id);
CREATE INDEX IF NOT EXISTS idx_payments_category ON public.payment_collections(category);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payment_collections(status);

-- ==============================================================================
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.educational_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_collections ENABLE ROW LEVEL SECURITY;

-- Allow read/write for public/anon key (or authenticated)
CREATE POLICY "Public Read Access on Centers"
ON public.educational_centers FOR SELECT USING (true);

CREATE POLICY "Public Insert/Update on Centers"
ON public.educational_centers FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Access on Inventory Distributions"
ON public.inventory_distributions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Access on Payment Collections"
ON public.payment_collections FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 7. STORAGE BUCKET FOR PAYMENT PROOF SCREENSHOTS
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access on Payment Proofs"
ON storage.objects FOR ALL
USING (bucket_id = 'payment-proofs')
WITH CHECK (bucket_id = 'payment-proofs');

-- ==============================================================================
-- 8. SEED INITIAL DATA
-- ==============================================================================

INSERT INTO public.educational_centers (id, name, governorate, city, contact_person, phone, book_price, book_center_cut, code_price, code_center_cut)
VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Al-Nour Educational Center (Dokki)',
    'Giza',
    'Dokki',
    'Mr. Mahmoud Tarek (Manager)',
    '01012345678',
    400.00,
    50.00,
    250.00,
    30.00
),
(
    '22222222-2222-2222-2222-222222222222',
    'Oxford Academy Center (Nasr City)',
    'Cairo',
    'Nasr City',
    'Capt. Hany Farag',
    '01123456789',
    400.00,
    60.00,
    250.00,
    40.00
),
(
    '33333333-3333-3333-3333-333333333333',
    'Elite Stars Center (Smouha)',
    'Alexandria',
    'Smouha',
    'Dr. Sherif Adel',
    '01234567890',
    450.00,
    50.00,
    300.00,
    50.00
),
(
    '44444444-4444-4444-4444-444444444444',
    'Al-Safwa Center (Mansoura)',
    'Dakahlia',
    'Mansoura',
    'Eng. Mostafa Nour',
    '01099887766',
    400.00,
    40.00,
    200.00,
    25.00
)
ON CONFLICT (id) DO NOTHING;

-- Initial Distributions
INSERT INTO public.inventory_distributions (center_id, center_name, assistant_name, books_count, codes_count, notes, distribution_date)
VALUES
('11111111-1111-1111-1111-111111111111', 'Al-Nour Educational Center (Dokki)', 'Sarah Mohamed (Assistant)', 200, 200, 'Batch 1 for Term 1', CURRENT_DATE - 15),
('11111111-1111-1111-1111-111111111111', 'Al-Nour Educational Center (Dokki)', 'Kareem Nabil (Assistant)', 100, 50, 'Restock batch', CURRENT_DATE - 5),
('22222222-2222-2222-2222-222222222222', 'Oxford Academy Center (Nasr City)', 'Sarah Mohamed (Assistant)', 150, 150, 'Initial semester delivery', CURRENT_DATE - 12),
('33333333-3333-3333-3333-333333333333', 'Elite Stars Center (Smouha)', 'Kareem Nabil (Assistant)', 120, 100, 'Delivered to reception', CURRENT_DATE - 8),
('44444444-4444-4444-4444-444444444444', 'Al-Safwa Center (Mansoura)', 'Sarah Mohamed (Assistant)', 80, 80, 'Monthly supply', CURRENT_DATE - 20);

-- Initial Collections
INSERT INTO public.payment_collections (center_id, center_name, assistant_name, amount_collected, category, books_portion, codes_portion, payment_method, receipt_proof_url, notes, collection_date, status)
VALUES
('11111111-1111-1111-1111-111111111111', 'Al-Nour Educational Center (Dokki)', 'Sarah Mohamed (Assistant)', 70000.00, 'books', 70000.00, 0.00, 'instapay', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000', 'Partial settlement for books via InstaPay', CURRENT_DATE - 2, 'verified'),
('22222222-2222-2222-2222-222222222222', 'Oxford Academy Center (Nasr City)', 'Kareem Nabil (Assistant)', 45000.00, 'both', 25000.00, 20000.00, 'vodafone_cash', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1000', 'Transfer screenshot attached (25k books + 20k codes)', CURRENT_DATE - 1, 'pending_verification'),
('33333333-3333-3333-3333-333333333333', 'Elite Stars Center (Smouha)', 'Kareem Nabil (Assistant)', 35000.00, 'codes', 0.00, 35000.00, 'cash', null, 'Cash for platform codes handed in envelope', CURRENT_DATE - 3, 'verified');
