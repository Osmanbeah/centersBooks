import React, { useState, useMemo } from 'react';
import { useCenters } from '../../context/CenterContext';
import { LogDistributionModal } from './LogDistributionModal';
import { LogCollectionModal } from './LogCollectionModal';
import { PaymentProofLightbox } from '../common/PaymentProofLightbox';
import { 
  Building2, 
  BookOpen, 
  KeyRound, 
  PlusCircle, 
  Banknote, 
  Search, 
  MapPin, 
  Phone, 
  Zap, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Image as ImageIcon,
  Copy,
  Check,
  Truck
} from 'lucide-react';

export const AssistantView: React.FC = () => {
  const { centers, distributions, collections } = useCenters();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'centers' | 'distributions' | 'collections'>('centers');
  
  // Modals
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedCenterForAction, setSelectedCenterForAction] = useState<string | undefined>(undefined);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered Centers
  const filteredCenters = useMemo(() => {
    return centers.filter(c => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.governorate.toLowerCase().includes(q) ||
        c.contact_person.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    });
  }, [centers, searchQuery]);

  // Total sums (quantities only)
  const totalBooksDelivered = distributions.reduce((sum, d) => sum + d.books_count, 0);
  const totalCodesDelivered = distributions.reduce((sum, d) => sum + d.codes_count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>Assistant Operations & Field Logistics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Center Delivery & Handover Queue
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Record physical book drops, activation codes, and collection receipts for all educational centers.
          </p>

          {/* Quick Quantities Summary */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <p className="text-slate-400">Total Books Logged</p>
                <p className="text-lg font-black text-white">{totalBooksDelivered.toLocaleString()} pcs</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <KeyRound className="w-4 h-4" />
              </span>
              <div>
                <p className="text-slate-400">Total Codes Logged</p>
                <p className="text-lg font-black text-white">{totalCodesDelivered.toLocaleString()} pcs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setSelectedCenterForAction(undefined);
              setIsDropModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02]"
          >
            <BookOpen className="w-4 h-4" />
            <span>+ Record Delivery (Books/Codes)</span>
          </button>

          <button
            onClick={() => {
              setSelectedCenterForAction(undefined);
              setIsCollectModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <Banknote className="w-4 h-4" />
            <span>+ Record Payment Collection</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('centers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'centers'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>Educational Centers ({centers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('distributions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'distributions'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Drop-off Logs ({distributions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'collections'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Banknote className="w-4 h-4 text-emerald-600" />
            <span>Payment Receipts ({collections.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search center name, city, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>
      </div>

      {/* View 1: Centers Cards Grid */}
      {activeTab === 'centers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCenters.map(center => {
            const centerDrops = distributions.filter(d => d.center_id === center.id);
            const totalBooks = centerDrops.reduce((sum, d) => sum + d.books_count, 0);
            const totalCodes = centerDrops.reduce((sum, d) => sum + d.codes_count, 0);
            const recentDrop = centerDrops[0];

            return (
              <div
                key={center.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {center.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 flex-shrink-0">
                      {center.governorate}
                    </span>
                  </div>

                  {/* Location & Contact */}
                  <div className="space-y-1 text-xs text-slate-600 mb-4">
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span>{center.city}, {center.governorate}</span>
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-medium text-slate-700">{center.contact_person}</span>
                      <button
                        onClick={() => handleCopy(center.phone, `phone-${center.id}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-teal-600" />
                        <span>{center.phone}</span>
                        {copiedKey === `phone-${center.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Inventory Totals Badge Box */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                    <div className="text-center p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Books Dropped</p>
                      <p className="text-lg font-black text-teal-700 mt-0.5">{totalBooks} <span className="text-[10px] font-normal text-slate-500">pcs</span></p>
                    </div>

                    <div className="text-center p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Codes Dropped</p>
                      <p className="text-lg font-black text-indigo-700 mt-0.5">{totalCodes} <span className="text-[10px] font-normal text-slate-500">pcs</span></p>
                    </div>
                  </div>

                  {recentDrop && (
                    <p className="text-[11px] text-slate-400 italic mb-2">
                      Last drop: {recentDrop.books_count} books, {recentDrop.codes_count} codes on {recentDrop.distribution_date}
                    </p>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedCenterForAction(center.id);
                      setIsDropModalOpen(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                    <span>+ Deliver Items</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCenterForAction(center.id);
                      setIsCollectModalOpen(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+ Collect Money</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Distributions History Table */}
      {activeTab === 'distributions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Center</th>
                  <th className="py-3 px-4">Books Handed</th>
                  <th className="py-3 px-4">Codes Handed</th>
                  <th className="py-3 px-4">Handover Date</th>
                  <th className="py-3 px-4">Delivered By</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {distributions.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.center_name}</td>
                    <td className="py-3 px-4 font-black text-teal-700 text-sm">
                      {d.books_count} <span className="text-xs font-normal text-slate-500">books</span>
                    </td>
                    <td className="py-3 px-4 font-black text-indigo-700 text-sm">
                      {d.codes_count} <span className="text-xs font-normal text-slate-500">codes</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{d.distribution_date}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{d.assistant_name}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{d.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Collections History Table with Receipt Thumbnails */}
      {activeTab === 'collections' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Center</th>
                  <th className="py-3 px-4">Payment For</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount Collected</th>
                  <th className="py-3 px-4">Proof Screenshot</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Collected By</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {collections.map(c => {
                  let MethodIcon = Banknote;
                  let methodBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                  if (c.payment_method === 'instapay') {
                    MethodIcon = Zap;
                    methodBadge = 'bg-purple-50 text-purple-800 border-purple-200';
                  } else if (c.payment_method === 'vodafone_cash') {
                    MethodIcon = Smartphone;
                    methodBadge = 'bg-red-50 text-red-800 border-red-200';
                  }

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.center_name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          c.category === 'books' 
                            ? 'bg-teal-50 text-teal-800 border-teal-200' 
                            : c.category === 'codes' 
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200' 
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}>
                          {c.category === 'books' ? '📚 Books' : c.category === 'codes' ? '🔑 Codes' : '📦 Split (Both)'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${methodBadge}`}>
                          <MethodIcon className="w-3.5 h-3.5" />
                          <span className="capitalize">{c.payment_method.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-700 text-sm">
                        {(c.amount_collected || 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-500">EGP</span>
                      </td>
                      <td className="py-3 px-4">
                        {c.receipt_proof_url ? (
                          <div
                            onClick={() => setLightboxImageUrl(c.receipt_proof_url!)}
                            className="cursor-pointer group relative w-12 h-12 rounded-xl overflow-hidden border border-slate-300 shadow-2xs hover:ring-2 hover:ring-teal-500 transition-all flex items-center justify-center bg-slate-100"
                            title="Click to view payment proof"
                          >
                            <img
                              src={c.receipt_proof_url}
                              alt="Receipt"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ImageIcon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Cash Handover (No Photo)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{c.collection_date}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{c.assistant_name}</td>
                      <td className="py-3 px-4">
                        {c.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>Pending Review</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{c.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <LogDistributionModal
        isOpen={isDropModalOpen}
        onClose={() => setIsDropModalOpen(false)}
        preselectedCenterId={selectedCenterForAction}
      />

      <LogCollectionModal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        preselectedCenterId={selectedCenterForAction}
      />

      <PaymentProofLightbox
        imageUrl={lightboxImageUrl}
        onClose={() => setLightboxImageUrl(null)}
      />
    </div>
  );
};
