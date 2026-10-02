import React, { useState, useEffect } from 'react';
import { useCenters } from '../../context/CenterContext';
import { X, BookOpen, KeyRound, Calendar, FileText, CheckCircle2, Layers } from 'lucide-react';

interface LogDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCenterId?: string;
}

type DeliveryItemType = 'both' | 'books' | 'codes';

export const LogDistributionModal: React.FC<LogDistributionModalProps> = ({
  isOpen,
  onClose,
  preselectedCenterId,
}) => {
  const { centers, addDistribution } = useCenters();

  const [centerId, setCenterId] = useState<string>(preselectedCenterId || centers[0]?.id || '');
  const [deliveryType, setDeliveryType] = useState<DeliveryItemType>('both');
  const [booksCount, setBooksCount] = useState<number>(100);
  const [codesCount, setCodesCount] = useState<number>(100);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [assistantName, setAssistantName] = useState<string>('Assistant Mohamed');

  useEffect(() => {
    if (preselectedCenterId) {
      setCenterId(preselectedCenterId);
    } else if (centers.length > 0 && !centerId) {
      setCenterId(centers[0].id);
    }
  }, [preselectedCenterId, centers, centerId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerId) return;

    const finalBooks = deliveryType === 'codes' ? 0 : Number(booksCount) || 0;
    const finalCodes = deliveryType === 'books' ? 0 : Number(codesCount) || 0;

    if (finalBooks === 0 && finalCodes === 0) {
      alert('Please enter at least 1 book or 1 code to record this delivery.');
      return;
    }

    addDistribution(
      centerId,
      finalBooks,
      finalCodes,
      notes,
      date,
      assistantName
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Items Delivery</h3>
              <p className="text-xs text-slate-500">Log physical books and/or activation codes handed to a center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Center Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Educational Center *
            </label>
            <select
              required
              value={centerId}
              onChange={e => setCenterId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-semibold"
            >
              {centers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.governorate} — {c.city})
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Type Selection (Books / Codes / Both) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>What are you delivering to this center? *</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {/* Option 1: Books Only */}
              <button
                type="button"
                onClick={() => setDeliveryType('books')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  deliveryType === 'books'
                    ? 'bg-teal-50/80 border-teal-600 text-teal-950 font-bold ring-2 ring-teal-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BookOpen className={`w-5 h-5 mb-1 ${deliveryType === 'books' ? 'text-teal-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">Books Only</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Physical books</span>
              </button>

              {/* Option 2: Codes Only */}
              <button
                type="button"
                onClick={() => setDeliveryType('codes')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  deliveryType === 'codes'
                    ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <KeyRound className={`w-5 h-5 mb-1 ${deliveryType === 'codes' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">Codes Only</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Activation cards</span>
              </button>

              {/* Option 3: Both Books & Codes */}
              <button
                type="button"
                onClick={() => setDeliveryType('both')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  deliveryType === 'both'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold ring-2 ring-slate-900/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <BookOpen className={`w-4 h-4 ${deliveryType === 'both' ? 'text-teal-300' : 'text-slate-400'}`} />
                  <span className="text-xs font-black">+</span>
                  <KeyRound className={`w-4 h-4 ${deliveryType === 'both' ? 'text-indigo-300' : 'text-slate-400'}`} />
                </div>
                <span className="text-xs font-bold">Both</span>
                <span className={`text-[10px] mt-0.5 ${deliveryType === 'both' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Books & Codes
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Quantities Input Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            {deliveryType === 'both' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Books quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>Books Delivered *</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={booksCount}
                    onChange={e => setBooksCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-base font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
                    placeholder="e.g. 200"
                  />
                </div>

                {/* Codes quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Codes Delivered *</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={codesCount}
                    onChange={e => setCodesCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-base font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                    placeholder="e.g. 200"
                  />
                </div>
              </div>
            )}

            {deliveryType === 'books' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>Books Delivered (Quantity) *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    required
                    value={booksCount}
                    onChange={e => setBooksCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 text-lg font-black text-teal-900 border border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
                    placeholder="e.g. 200"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-teal-700">
                    Copies
                  </span>
                </div>
              </div>
            )}

            {deliveryType === 'codes' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <span>Codes Delivered (Quantity) *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    required
                    value={codesCount}
                    onChange={e => setCodesCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 text-lg font-black text-indigo-900 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                    placeholder="e.g. 200"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-700">
                    Cards / Codes
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Date & Assistant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Handover Date *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Delivered By (Assistant Name)
              </label>
              <input
                type="text"
                value={assistantName}
                onChange={e => setAssistantName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Drop-off Notes / Batch Details</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg placeholder-slate-400 bg-white"
              placeholder="e.g. Handed to reception manager, received in good condition..."
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Save Delivery</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

