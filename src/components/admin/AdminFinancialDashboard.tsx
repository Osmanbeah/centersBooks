import React, { useState, useMemo } from 'react';
import { useCenters } from '../../context/CenterContext';
import { EditPricingModal } from './EditPricingModal';
import { AddCenterModal } from './AddCenterModal';
import { PaymentProofLightbox } from '../common/PaymentProofLightbox';
import { exportCenterLedgerToCSV } from '../../lib/exportUtils';
import type { EducationalCenter } from '../../types';
import { 
  Building2, 
  Download, 
  Plus, 
  Search, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  PiggyBank,
  Receipt,
  BookOpen,
  KeyRound,
  Layers
} from 'lucide-react';

export const AdminFinancialDashboard: React.FC = () => {
  const { 
    financialSummaries, 
    globalKPIs, 
    collections, 
    verifyCollection, 
    deleteCenter 
  } = useCenters();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLedgerView, setActiveLedgerView] = useState<'combined' | 'books' | 'codes'>('combined');
  const [selectedCenterForEdit, setSelectedCenterForEdit] = useState<EducationalCenter | null>(null);
  const [isAddCenterOpen, setIsAddCenterOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  const filteredSummaries = useMemo(() => {
    return financialSummaries.filter(s => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        s.center.name.toLowerCase().includes(q) ||
        s.center.city.toLowerCase().includes(q) ||
        s.center.governorate.toLowerCase().includes(q) ||
        s.center.contact_person.toLowerCase().includes(q) ||
        s.center.phone.includes(q)
      );
    });
  }, [financialSummaries, searchQuery]);

  const pendingCollections = collections.filter(c => c.status === 'pending_verification');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Top Header & Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Centers Financial & Settlement Command
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-100 text-teal-800 border border-teal-200">
              Admin Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Separated Books & Activation Codes financial breakdown with center commission deductions and net owner revenue.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => exportCenterLedgerToCSV(financialSummaries)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export Statement (CSV)</span>
          </button>

          <button
            onClick={() => setIsAddCenterOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Educational Center</span>
          </button>
        </div>
      </div>

      {/* Separated Stream KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Books Revenue Stream */}
        <div className="bg-white rounded-3xl p-5 border border-teal-200 shadow-2xs flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white to-teal-50/40">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-100 text-teal-900">
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                <span>Books Revenue Stream</span>
              </span>
              <span className="text-xs font-bold text-slate-400">{globalKPIs.totalBooksDistributed} Books</span>
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Books Net Owner Due</p>
              <h3 className="text-2xl font-black text-teal-900 mt-0.5">
                {globalKPIs.totalBooksNet.toLocaleString()} <span className="text-xs font-normal text-slate-500">EGP</span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-teal-100 text-xs">
            <div className="bg-white p-2 rounded-xl border border-teal-100">
              <span className="text-[10px] text-slate-400 block font-bold">Books Collected</span>
              <span className="text-sm font-black text-emerald-700">{globalKPIs.totalBooksCollected.toLocaleString()} EGP</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-teal-100">
              <span className="text-[10px] text-slate-400 block font-bold">Books Unpaid</span>
              <span className="text-sm font-black text-rose-600">{globalKPIs.totalBooksOutstanding.toLocaleString()} EGP</span>
            </div>
          </div>
        </div>

        {/* Codes Revenue Stream */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-200 shadow-2xs flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white to-indigo-50/40">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-900">
                <KeyRound className="w-3.5 h-3.5 text-indigo-700" />
                <span>Codes Revenue Stream</span>
              </span>
              <span className="text-xs font-bold text-slate-400">{globalKPIs.totalCodesDistributed} Codes</span>
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Codes Net Owner Due</p>
              <h3 className="text-2xl font-black text-indigo-900 mt-0.5">
                {globalKPIs.totalCodesNet.toLocaleString()} <span className="text-xs font-normal text-slate-500">EGP</span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-indigo-100 text-xs">
            <div className="bg-white p-2 rounded-xl border border-indigo-100">
              <span className="text-[10px] text-slate-400 block font-bold">Codes Collected</span>
              <span className="text-sm font-black text-emerald-700">{globalKPIs.totalCodesCollected.toLocaleString()} EGP</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-indigo-100">
              <span className="text-[10px] text-slate-400 block font-bold">Codes Unpaid</span>
              <span className="text-sm font-black text-rose-600">{globalKPIs.totalCodesOutstanding.toLocaleString()} EGP</span>
            </div>
          </div>
        </div>

        {/* Total Overall Net Profit */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-3xl p-5 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                <PiggyBank className="w-3.5 h-3.5 text-amber-400" />
                <span>Total Combined Net Due</span>
              </span>
              <span className="text-xs text-slate-400">{globalKPIs.totalCenters} Centers</span>
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-bold text-teal-300/80 uppercase tracking-wider">My Total Net Profit</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                {globalKPIs.totalOwnerNetProfit.toLocaleString()} <span className="text-xs font-semibold text-teal-300">EGP</span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-bold">Total Collected</span>
              <span className="text-sm font-black text-emerald-400">{globalKPIs.totalCollected.toLocaleString()} EGP</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-bold">Total Remaining Dues</span>
              <span className="text-sm font-black text-rose-400">{globalKPIs.totalOutstandingBalance.toLocaleString()} EGP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payment Proofs Verification Queue */}
      {pendingCollections.length > 0 && (
        <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-200 text-amber-900">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-amber-950">
                  Pending Payment Proofs Awaiting Verification ({pendingCollections.length})
                </h3>
                <p className="text-xs text-amber-800">
                  Review uploaded InstaPay / Vodafone Cash receipts and verify the credited revenue category.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingCollections.map(col => (
              <div
                key={col.id}
                className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">{col.center_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                      {col.payment_method.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-100 text-teal-800">
                      {col.category === 'books' ? '📚 Books' : col.category === 'codes' ? '🔑 Codes' : '📦 Split'}
                    </span>
                  </div>

                  <p className="text-xs font-black text-emerald-700">
                    Amount: {(col.amount_collected || 0).toLocaleString()} EGP
                  </p>

                  <p className="text-xs text-slate-500">
                    Collected by <strong>{col.assistant_name}</strong> on {col.collection_date}
                  </p>

                  {col.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg font-mono">
                      📝 {col.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => verifyCollection(col.id, 'verified')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>

                    <button
                      onClick={() => verifyCollection(col.id, 'rejected')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {col.receipt_proof_url && (
                  <div
                    onClick={() => setLightboxImageUrl(col.receipt_proof_url!)}
                    className="cursor-pointer group relative w-20 h-20 rounded-xl overflow-hidden border border-slate-300 flex-shrink-0 shadow-sm hover:ring-2 hover:ring-teal-500 transition-all bg-slate-900"
                    title="Click to zoom screenshot"
                  >
                    <img
                      src={col.receipt_proof_url}
                      alt="Proof"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Centers Settlement Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>Centers Financial Settlement Ledger</span>
            </h2>
            <p className="text-xs text-slate-500">
              Clear breakdown of books money, codes money, commission cuts, collected funds, and unpaid balances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Selector Tabs */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
              <button
                onClick={() => setActiveLedgerView('combined')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeLedgerView === 'combined'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>Combined Overview</span>
              </button>

              <button
                onClick={() => setActiveLedgerView('books')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeLedgerView === 'books'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>Books Ledger Only</span>
              </button>

              <button
                onClick={() => setActiveLedgerView('codes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeLedgerView === 'codes'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>Codes Ledger Only</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-60">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search center name, city..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Table based on Active View */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Center & Contact</th>

                {/* Combined Overview Columns */}
                {activeLedgerView === 'combined' && (
                  <>
                    <th className="py-3.5 px-4 text-teal-800 bg-teal-50/30">
                      📚 Books Financials (Net / Col / Unpaid)
                    </th>
                    <th className="py-3.5 px-4 text-indigo-800 bg-indigo-50/30">
                      🔑 Codes Financials (Net / Col / Unpaid)
                    </th>
                    <th className="py-3.5 px-4 text-teal-900 font-extrabold bg-teal-50/50">Total Net Due</th>
                    <th className="py-3.5 px-4 text-emerald-700">Total Collected</th>
                    <th className="py-3.5 px-4 text-rose-700">Total Unpaid</th>
                  </>
                )}

                {/* Books Only Columns */}
                {activeLedgerView === 'books' && (
                  <>
                    <th className="py-3.5 px-4">Books Delivered</th>
                    <th className="py-3.5 px-4">Price & Cut / Book</th>
                    <th className="py-3.5 px-4">Books Gross Sales</th>
                    <th className="py-3.5 px-4 text-rose-600">Center Cut</th>
                    <th className="py-3.5 px-4 text-teal-800 font-extrabold bg-teal-50/40">Books Net Due</th>
                    <th className="py-3.5 px-4 text-emerald-700">Books Collected</th>
                    <th className="py-3.5 px-4 text-rose-700">Books Unpaid</th>
                  </>
                )}

                {/* Codes Only Columns */}
                {activeLedgerView === 'codes' && (
                  <>
                    <th className="py-3.5 px-4">Codes Delivered</th>
                    <th className="py-3.5 px-4">Price & Cut / Code</th>
                    <th className="py-3.5 px-4">Codes Gross Sales</th>
                    <th className="py-3.5 px-4 text-rose-600">Center Cut</th>
                    <th className="py-3.5 px-4 text-indigo-800 font-extrabold bg-indigo-50/40">Codes Net Due</th>
                    <th className="py-3.5 px-4 text-emerald-700">Codes Collected</th>
                    <th className="py-3.5 px-4 text-rose-700">Codes Unpaid</th>
                  </>
                )}

                <th className="py-3.5 px-4 text-center">Configure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSummaries.map(s => {
                const c = s.center;
                const netPerBook = c.book_price - c.book_center_cut;
                const netPerCode = c.code_price - c.code_center_cut;

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Center Info */}
                    <td className="py-4 px-4 align-top">
                      <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{c.city}, {c.governorate}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{c.phone}</p>
                    </td>

                    {/* View 1: Combined Overview */}
                    {activeLedgerView === 'combined' && (
                      <>
                        {/* Books Summary Cell */}
                        <td className="py-4 px-4 align-top bg-teal-50/20">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">Delivered:</span>
                              <strong className="text-slate-900">{s.total_books_delivered} books</strong>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-teal-700 font-bold">Net Due:</span>
                              <strong className="text-teal-900">{s.books_owner_net_due.toLocaleString()} EGP</strong>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-emerald-700 font-bold">Collected:</span>
                              <strong className="text-emerald-800">{s.books_collected.toLocaleString()} EGP</strong>
                            </div>
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-teal-100">
                              <span className="text-rose-600 font-bold">Unpaid:</span>
                              <strong className="text-rose-700 font-black">{s.books_outstanding_balance.toLocaleString()} EGP</strong>
                            </div>
                          </div>
                        </td>

                        {/* Codes Summary Cell */}
                        <td className="py-4 px-4 align-top bg-indigo-50/20">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">Delivered:</span>
                              <strong className="text-slate-900">{s.total_codes_delivered} codes</strong>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-indigo-700 font-bold">Net Due:</span>
                              <strong className="text-indigo-900">{s.codes_owner_net_due.toLocaleString()} EGP</strong>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-emerald-700 font-bold">Collected:</span>
                              <strong className="text-emerald-800">{s.codes_collected.toLocaleString()} EGP</strong>
                            </div>
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-indigo-100">
                              <span className="text-rose-600 font-bold">Unpaid:</span>
                              <strong className="text-rose-700 font-black">{s.codes_outstanding_balance.toLocaleString()} EGP</strong>
                            </div>
                          </div>
                        </td>

                        {/* Total Net Due */}
                        <td className="py-4 px-4 align-top font-black text-teal-900 text-sm bg-teal-50/40">
                          {s.owner_net_due.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">EGP</span>
                        </td>

                        {/* Total Collected */}
                        <td className="py-4 px-4 align-top font-bold text-emerald-700 text-sm">
                          {s.total_collected.toLocaleString()} <span className="text-[10px] text-slate-400">EGP</span>
                        </td>

                        {/* Total Unpaid */}
                        <td className="py-4 px-4 align-top">
                          {s.outstanding_balance > 0 ? (
                            <div>
                              <span className="font-black text-rose-600 text-sm">
                                {s.outstanding_balance.toLocaleString()} EGP
                              </span>
                              <span className="block text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded mt-1 border border-rose-200/60">
                                Pending Settlement
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Settled</span>
                            </span>
                          )}
                        </td>
                      </>
                    )}

                    {/* View 2: Books Only */}
                    {activeLedgerView === 'books' && (
                      <>
                        <td className="py-4 px-4 align-top font-black text-slate-900 text-sm">
                          {s.total_books_delivered} <span className="text-xs font-normal text-slate-500">books</span>
                        </td>
                        <td className="py-4 px-4 align-top text-[11px]">
                          <div>Price: <strong>{c.book_price} EGP</strong></div>
                          <div className="text-rose-600">Cut: <strong>-{c.book_center_cut} EGP</strong></div>
                          <div className="text-teal-700 font-bold border-t mt-0.5 pt-0.5">Net: {netPerBook} EGP</div>
                        </td>
                        <td className="py-4 px-4 align-top font-bold text-slate-800">
                          {s.gross_books_revenue.toLocaleString()} EGP
                        </td>
                        <td className="py-4 px-4 align-top font-bold text-rose-600">
                          -{s.books_center_cut.toLocaleString()} EGP
                        </td>
                        <td className="py-4 px-4 align-top font-black text-teal-800 text-sm bg-teal-50/40">
                          {s.books_owner_net_due.toLocaleString()} EGP
                        </td>
                        <td className="py-4 px-4 align-top font-bold text-emerald-700">
                          {s.books_collected.toLocaleString()} EGP
                        </td>
                        <td className="py-4 px-4 align-top font-black text-rose-600">
                          {s.books_outstanding_balance.toLocaleString()} EGP
                        </td>
                      </>
                    )}

                    {/* View 3: Codes Only */}
                    {activeLedgerView === 'codes' && (
                      <>
                        <td className="py-4 px-4 align-top font-black text-indigo-900 text-sm">
                          {s.total_codes_delivered} <span className="text-xs font-normal text-slate-500">codes</span>
                        </td>
                        <td className="py-4 px-4 align-top text-[11px]">
                          <div>Price: <strong>{c.code_price} EGP</strong></div>
                          <div className="text-rose-600">Cut: <strong>-{c.code_center_cut} EGP</strong></div>
                          <div className="text-indigo-700 font-bold border-t mt-0.5 pt-0.5">Net: {netPerCode} EGP</div>
                        </td>
                        <td className="py-4 px-4 align-top font-bold text-slate-800">
                          {s.gross_codes_revenue.toLocaleString()} EGP
                        </td>
                        <td className="py-4 px-4 align-top font-bold text-rose-600">
                          -{s.codes_center_cut.toLocaleString()} EGP
                        </td>
                        <td className="py-4 px-4 align-top font-black text-indigo-800 text-sm bg-indigo-50/40">
                          {s.codes_owner_net_due.toLocaleString()} EGP
                        </td>
                        <td className="py-4 px-4 align-top font-bold text-emerald-700">
                          {s.codes_collected.toLocaleString()} EGP
                        </td>
                        <td className="py-4 px-4 align-top font-black text-rose-600">
                          {s.codes_outstanding_balance.toLocaleString()} EGP
                        </td>
                      </>
                    )}

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedCenterForEdit(c)}
                          title="Configure Prices & Center Cut"
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${c.name}?`)) {
                              deleteCenter(c.id);
                            }
                          }}
                          title="Delete Center"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EditPricingModal
        center={selectedCenterForEdit}
        onClose={() => setSelectedCenterForEdit(null)}
      />

      <AddCenterModal
        isOpen={isAddCenterOpen}
        onClose={() => setIsAddCenterOpen(false)}
      />

      <PaymentProofLightbox
        imageUrl={lightboxImageUrl}
        onClose={() => setLightboxImageUrl(null)}
      />
    </div>
  );
};
