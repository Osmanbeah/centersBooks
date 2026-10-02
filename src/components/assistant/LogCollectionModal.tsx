import React, { useState, useRef } from 'react';
import { useCenters } from '../../context/CenterContext';
import type { PaymentMethod, CollectionCategory } from '../../types';
import { 
  X, 
  Banknote, 
  Smartphone, 
  Zap, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Image as ImageIcon,
  UploadCloud,
  Trash2
} from 'lucide-react';

interface LogCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCenterId?: string;
}

export const LogCollectionModal: React.FC<LogCollectionModalProps> = ({
  isOpen,
  onClose,
  preselectedCenterId,
}) => {
  const { centers, addCollection } = useCenters();

  const [centerId, setCenterId] = useState<string>(preselectedCenterId || centers[0]?.id || '');
  const [category, setCategory] = useState<CollectionCategory>('books');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amount, setAmount] = useState<number>(5000);
  const [booksPortion, setBooksPortion] = useState<number>(3000);
  const [codesPortion, setCodesPortion] = useState<number>(2000);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [assistantName, setAssistantName] = useState<string>('Assistant Mohamed');

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (preselectedCenterId) {
      setCenterId(preselectedCenterId);
    } else if (centers.length > 0 && !centerId) {
      setCenterId(centers[0].id);
    }
  }, [preselectedCenterId, centers, centerId]);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setUploadedFileName(file.name);
    const sizeInKb = file.size / 1024;
    const formattedSize = sizeInKb > 1024 
      ? `${(sizeInKb / 1024).toFixed(2)} MB` 
      : `${Math.round(sizeInKb)} KB`;
    setUploadedFileSize(formattedSize);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedFileName('');
    setUploadedFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerId) return;

    let finalAmount = Number(amount);
    let finalBkPortion = Number(booksPortion);
    let finalCdPortion = Number(codesPortion);

    if (category === 'both') {
      finalAmount = finalBkPortion + finalCdPortion;
      if (finalAmount <= 0) {
        alert('Please enter a valid amount for books or codes.');
        return;
      }
    } else {
      if (!finalAmount || finalAmount <= 0) {
        alert('Please enter a valid collection amount.');
        return;
      }
      if (category === 'books') {
        finalBkPortion = finalAmount;
        finalCdPortion = 0;
      } else {
        finalBkPortion = 0;
        finalCdPortion = finalAmount;
      }
    }

    if ((paymentMethod === 'instapay' || paymentMethod === 'vodafone_cash') && !uploadedImage) {
      alert('Please upload a screenshot of the payment transfer proof.');
      return;
    }

    const proof = (paymentMethod === 'instapay' || paymentMethod === 'vodafone_cash') ? uploadedImage : null;

    addCollection(
      centerId,
      paymentMethod,
      proof,
      notes,
      date,
      assistantName,
      finalAmount,
      category,
      finalBkPortion,
      finalCdPortion
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Center Payment Collection</h3>
              <p className="text-xs text-slate-500">Log monthly settlement payment from center</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
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
                  {c.name} ({c.governorate})
                </option>
              ))}
            </select>
          </div>

          {/* Collection Category Selector (Books / Codes / Both) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>What is this payment collected for? *</span>
              <span className="text-[10px] text-teal-700 font-bold uppercase">Revenue Category</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('books')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  category === 'books'
                    ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold ring-2 ring-teal-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold flex items-center gap-1 text-teal-800">
                  📚 Books Money
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">Physical books</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('codes')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  category === 'codes'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold flex items-center gap-1 text-indigo-800">
                  🔑 Codes Money
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">Activation codes</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('both')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  category === 'both'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold ring-2 ring-slate-900/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold flex items-center gap-1">
                  📦 Both / Split
                </span>
                <span className={`text-[10px] mt-0.5 ${category === 'both' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Books + Codes
                </span>
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4 text-amber-600" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('instapay')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                  paymentMethod === 'instapay'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-900 ring-2 ring-purple-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-4 h-4 text-purple-600" />
                <span>InstaPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('vodafone_cash')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                  paymentMethod === 'vodafone_cash'
                    ? 'bg-red-500/10 border-red-500 text-red-900 ring-2 ring-red-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 text-red-600" />
                <span>Vodafone Cash</span>
              </button>
            </div>
          </div>

          {/* Amount Collected Input (Dynamic based on Category) */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80">
            {category !== 'both' ? (
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Amount Collected for {category === 'books' ? '📚 Books' : '🔑 Codes'} *</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">EGP</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min={1}
                    step="any"
                    required
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3.5 pr-14 py-2.5 text-xl font-black text-emerald-950 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    placeholder="e.g. 5000"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-700 pointer-events-none">
                    EGP
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>Specify Split Amount *</span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Total: {(Number(booksPortion) + Number(codesPortion)).toLocaleString()} EGP
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">
                      📚 Books Portion (EGP) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      required
                      value={booksPortion}
                      onChange={e => setBooksPortion(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-base font-black text-teal-950 bg-white border border-teal-300 rounded-xl focus:ring-teal-500"
                      placeholder="e.g. 3000"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                      🔑 Codes Portion (EGP) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      required
                      value={codesPortion}
                      onChange={e => setCodesPortion(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-base font-black text-indigo-950 bg-white border border-indigo-300 rounded-xl focus:ring-indigo-500"
                      placeholder="e.g. 2000"
                    />
                  </div>
                </div>
              </div>
            )}

            <p className="text-[11px] text-emerald-800 mt-2">
              Payment will be automatically credited to the selected revenue stream.
            </p>
          </div>

          {/* Photo upload if InstaPay or Vodafone Cash */}
          {(paymentMethod === 'instapay' || paymentMethod === 'vodafone_cash') && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-teal-600" />
                  <span>Transfer Screenshot / Payment Proof *</span>
                </span>
                <span className="text-[10px] text-rose-600 font-bold uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Required Photo
                </span>
              </label>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Dropzone / Preview */}
              {!uploadedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-teal-500 bg-teal-50/80 scale-[1.01]'
                      : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center ring-4 ring-teal-50/50">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drag & drop photo
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Upload InstaPay receipt / Vodafone Cash SMS screenshot (PNG, JPG, WEBP)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-1 px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
                  >
                    Select Photo from Device
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-3 shadow-2xs">
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-48">
                    <img
                      src={uploadedImage}
                      alt="Payment proof preview"
                      className="max-h-48 w-auto object-contain rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono">
                      Photo Loaded
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <div className="truncate max-w-[200px]">
                      <p className="font-bold text-slate-800 truncate">{uploadedFileName || 'receipt_screenshot.png'}</p>
                      {uploadedFileSize && (
                        <p className="text-[10px] text-slate-400">{uploadedFileSize}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Change Photo
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Date & Assistant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Collection Date *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Collected By (Assistant Name)
              </label>
              <input
                type="text"
                value={assistantName}
                onChange={e => setAssistantName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Notes / Transaction Reference</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg placeholder-slate-400"
              placeholder="e.g. InstaPay reference #IPN-..., handed by accountant..."
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
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Payment Collection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
