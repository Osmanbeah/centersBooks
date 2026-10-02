import React, { useState } from 'react';
import { useCenters } from '../../context/CenterContext';
import { EGYPTIAN_GOVERNORATES } from '../../lib/mockData';
import { X, Building2, DollarSign, Plus } from 'lucide-react';

interface AddCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCenterModal: React.FC<AddCenterModalProps> = ({ isOpen, onClose }) => {
  const { addCenter } = useCenters();

  const [name, setName] = useState('');
  const [governorate, setGovernorate] = useState(EGYPTIAN_GOVERNORATES[0]);
  const [city, setCity] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  
  const [bookPrice, setBookPrice] = useState(400);
  const [bookCut, setBookCut] = useState(50);
  const [codePrice, setCodePrice] = useState(250);
  const [codeCut, setCodeCut] = useState(30);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCenter({
      name: name.trim(),
      governorate,
      city: city.trim() || governorate,
      contact_person: contactPerson.trim() || 'Center Reception',
      phone: phone.trim() || 'N/A',
      book_price: Number(bookPrice),
      book_center_cut: Number(bookCut),
      code_price: Number(codePrice),
      code_center_cut: Number(codeCut),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Educational Center</h3>
              <p className="text-xs text-slate-500">Register a new center for book & code deliveries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Center Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Al-Nour Academy (Dokki Branch)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-teal-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Governorate *
              </label>
              <select
                value={governorate}
                onChange={e => setGovernorate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                {EGYPTIAN_GOVERNORATES.map((gov: string) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                City / District *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nasr City / Dokki"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                placeholder="Manager / Accountant"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 01012345678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Pricing & Cuts */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-teal-600" />
              <span>Initial Pricing & Commission Agreement</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Book Price (EGP)</label>
                <input
                  type="number"
                  min={0}
                  value={bookPrice}
                  onChange={e => setBookPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Center Cut / Book (EGP)</label>
                <input
                  type="number"
                  min={0}
                  value={bookCut}
                  onChange={e => setBookCut(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white text-rose-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Code Price (EGP)</label>
                <input
                  type="number"
                  min={0}
                  value={codePrice}
                  onChange={e => setCodePrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Center Cut / Code (EGP)</label>
                <input
                  type="number"
                  min={0}
                  value={codeCut}
                  onChange={e => setCodeCut(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white text-rose-600"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
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
              <Plus className="w-4 h-4" />
              <span>Create Center</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
