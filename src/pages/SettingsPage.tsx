import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { 
  Database, 
  ShieldCheck, 
  Copy, 
  Check, 
  Building2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [copiedSql, setCopiedSql] = useState(false);

  const sampleSqlSchema = `-- Run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.educational_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    governorate TEXT NOT NULL,
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
    assistant_id UUID,
    assistant_name TEXT NOT NULL,
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
    assistant_id UUID,
    assistant_name TEXT NOT NULL,
    amount_collected NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL,
    receipt_proof_url TEXT,
    notes TEXT,
    collection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'pending_verification',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sampleSqlSchema);
    setCopiedSql(true);
    showToast('SQL schema copied to clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Database & Security Architecture
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          PostgreSQL tables, price confidentiality rules, and settlement calculation formulas.
        </p>
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
              <p className="text-xs text-slate-500">Run this script in Supabase SQL editor to deploy live tables.</p>
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

        <pre className="p-4 rounded-2xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto">
          {sampleSqlSchema}
        </pre>
      </div>
    </div>
  );
};
