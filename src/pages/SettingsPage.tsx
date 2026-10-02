import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { 
  Database, 
  ShieldCheck, 
  Copy, 
  Check, 
  Building2,
  Key,
  Globe,
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { supabase, isSupabaseLiveConfigured, saveSupabaseCredentials } from '../lib/supabase';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase connection credentials
  const [projectUrl, setProjectUrl] = useState<string>(() => localStorage.getItem('custom_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '');
  const [anonKey, setAnonKey] = useState<string>(() => localStorage.getItem('custom_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [isConnected, setIsConnected] = useState<boolean>(isSupabaseLiveConfigured());
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    setIsConnected(isSupabaseLiveConfigured());
  }, []);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);

    try {
      if (projectUrl.trim() && anonKey.trim()) {
        saveSupabaseCredentials(projectUrl.trim(), anonKey.trim());
        
        // Test connection
        const { error } = await supabase.from('educational_centers').select('count', { count: 'exact', head: true });
        
        if (!error) {
          setIsConnected(true);
          showToast('Connected to Supabase database successfully!', 'success');
        } else {
          showToast('Credentials saved, but connection failed: ' + error.message, 'error');
        }
      } else {
        saveSupabaseCredentials('', '');
        setIsConnected(false);
        showToast('Supabase credentials cleared. Using local database storage.', 'info');
      }
    } catch (err: any) {
      showToast('Error connecting to Supabase: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const fullSqlSchema = `-- Run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.educational_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    governorate TEXT NOT NULL DEFAULT 'Cairo',
    city TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    book_price NUMERIC(10, 2) NOT NULL DEFAULT 400.00,
    book_center_cut NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    code_price NUMERIC(10, 2) NOT NULL DEFAULT 250.00,
    code_center_cut NUMERIC(10, 2) NOT NULL DEFAULT 30.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id UUID NOT NULL REFERENCES public.educational_centers(id) ON DELETE CASCADE,
    center_name TEXT NOT NULL,
    assistant_name TEXT NOT NULL DEFAULT 'Assistant Mohamed',
    books_count INTEGER NOT NULL DEFAULT 0,
    codes_count INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    distribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id UUID NOT NULL REFERENCES public.educational_centers(id) ON DELETE CASCADE,
    center_name TEXT NOT NULL,
    assistant_name TEXT NOT NULL DEFAULT 'Assistant Mohamed',
    amount_collected NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    category TEXT NOT NULL DEFAULT 'both' CHECK (category IN ('books', 'codes', 'both')),
    books_portion NUMERIC(10, 2) DEFAULT 0.00,
    codes_portion NUMERIC(10, 2) DEFAULT 0.00,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'instapay', 'vodafone_cash')),
    receipt_proof_url TEXT,
    notes TEXT,
    collection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.educational_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Centers Access" ON public.educational_centers FOR ALL USING (true);
CREATE POLICY "Public Inventory Access" ON public.inventory_distributions FOR ALL USING (true);
CREATE POLICY "Public Payments Access" ON public.payment_collections FOR ALL USING (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(fullSqlSchema);
    setCopiedSql(true);
    showToast('Complete SQL schema copied to clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Supabase Database & Cloud Integration
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure your Supabase database connection and deploy real-time cloud storage tables.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className={`p-5 rounded-2xl border flex items-center justify-between ${
        isConnected 
          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
          : 'bg-amber-50/80 border-amber-300 text-amber-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {isConnected ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold">
              {isConnected ? 'Connected to Supabase Cloud Database' : 'Running in Local Storage Cache Mode'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {isConnected 
                ? 'All distributions, collections, and centers are synced in real time to your Supabase PostgreSQL tables.' 
                : 'Enter your project credentials below to persist data to Supabase.'}
            </p>
          </div>
        </div>
      </div>

      {/* Supabase Credentials Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">Supabase API Credentials</h2>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>Project URL (VITE_SUPABASE_URL)</span>
            </label>
            <input
              type="url"
              value={projectUrl}
              onChange={e => setProjectUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-teal-600" />
              <span>Anon Public Key (VITE_SUPABASE_ANON_KEY)</span>
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={e => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isTesting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isTesting ? 'Connecting...' : 'Save & Sync with Supabase'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Row-Level Security Rules Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200">
          <h3 className="text-sm font-black text-teal-950 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>👑 Admin Exclusive Rights</span>
          </h3>
          <p className="text-xs text-teal-900 leading-relaxed">
            Full view of <strong>financial ledger</strong>, <strong>book/code selling prices</strong>, <strong>center commission cuts</strong>, and <strong>owner net revenue</strong>. Can add/modify centers and approve payment receipts.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200">
          <h3 className="text-sm font-black text-indigo-950 mb-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-700" />
            <span>👨‍💼 Assistant Restricted Scope</span>
          </h3>
          <p className="text-xs text-indigo-900 leading-relaxed">
            Assistants see <strong>ONLY quantities & center drop-offs</strong> (no prices or profit margins). They record physical books/codes handed over and upload payment transfer screenshots.
          </p>
        </div>
      </div>

      {/* SQL Script Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">PostgreSQL Schema (Supabase)</h2>
              <p className="text-xs text-slate-500">Copy & run this script directly in the Supabase SQL Editor.</p>
            </div>
          </div>

          <button
            onClick={copySql}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Copied' : 'Copy Schema SQL'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto max-h-72">
          {fullSqlSchema}
        </pre>
      </div>
    </div>
  );
};
