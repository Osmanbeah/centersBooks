import React, { useState, useEffect } from 'react';
import { useCenters } from '../../context/CenterContext';
import type { EducationalCenter } from '../../types';
import { X, DollarSign, BookOpen, KeyRound, Save, Calculator } from 'lucide-react';

interface EditPricingModalProps {
  center: EducationalCenter | null;
  onClose: () => void;
}

export const EditPricingModal: React.FC<EditPricingModalProps> = ({ center, onClose }) => {
  const { updateCenterPricing } = useCenters();

  const [bookPrice, setBookPrice] = useState<number>(400);
  const [bookCut, setBookCut] = useState<number>(50);
  const [codePrice, setCodePrice] = useState<number>(250);
  const [codeCut, setCodeCut] = useState<number>(30);

  useEffect(() => {
    if (center) {
      setBookPrice(center.book_price);
      setBookCut(center.book_center_cut);
      setCodePrice(center.code_price);
      setCodeCut(center.code_center_cut);
    }
  }, [center]);

  if (!center) return null;

  const ownerBookShare = Math.max(0, bookPrice - bookCut);
  const ownerCodeShare = Math.max(0, codePrice - codeCut);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCenterPricing(
      center.id,
      Number(bookPrice),
      Number(bookCut),
      Number(codePrice),
      Number(codeCut)
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Set Prices & Center Commission Cut</h3>
              <p className="text-xs text-teal-700 font-semibold">{center.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Books Pricing Section */}
          <div className="bg-teal-50/40 p-4 rounded-2xl border border-teal-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Physical Books Pricing & Commission</span>
              </h4>
              <span className="text-xs font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-full">
                Your Share: {ownerBookShare} EGP
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Selling Price to Student (EGP) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={bookPrice}
                  onChange={e => setBookPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl bg-white focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Center's Cut / Commission (EGP) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={bookCut}
                  onChange={e => setBookCut(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl bg-white focus:ring-teal-500 text-rose-600"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              <span>Calculation: {bookPrice} EGP (Sale) - {bookCut} EGP (Center Cut) = <strong className="text-teal-700">{ownerBookShare} EGP (Net Profit)</strong> per book.</span>
            </div>
          </div>

          {/* Access Codes Pricing Section */}
          <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>Activation Access Codes Pricing</span>
              </h4>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded-full">
                Your Share: {ownerCodeShare} EGP
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Selling Price to Student (EGP) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={codePrice}
                  onChange={e => setCodePrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl bg-white focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Center's Cut / Commission (EGP) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={codeCut}
                  onChange={e => setCodeCut(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl bg-white focus:ring-indigo-500 text-rose-600"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              <span>Calculation: {codePrice} EGP (Sale) - {codeCut} EGP (Center Cut) = <strong className="text-indigo-700">{ownerCodeShare} EGP (Net Profit)</strong> per code.</span>
            </div>
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
              <Save className="w-4 h-4" />
              <span>Save Pricing Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
