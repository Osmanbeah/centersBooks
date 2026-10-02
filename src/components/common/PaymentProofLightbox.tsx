import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface PaymentProofLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
  title?: string;
}

export const PaymentProofLightbox: React.FC<PaymentProofLightboxProps> = ({ imageUrl, onClose, title }) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  if (!imageUrl) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 text-white">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-semibold">Payment Receipt Proof</h3>
              {title && <p className="text-xs text-slate-400">{title}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              title="Rotate"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Reset
            </button>
            
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Full Image"
              className="p-2 text-teal-400 hover:text-teal-300 hover:bg-teal-950/50 rounded-lg transition-colors ml-2"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="h-4 w-[1px] bg-slate-700 mx-1" />

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="relative flex-1 min-h-[400px] overflow-auto flex items-center justify-center p-6 bg-slate-950">
          <div
            className="transition-transform duration-200 ease-out origin-center"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={imageUrl}
              alt="Payment proof screenshot"
              className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800"
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-2.5 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-between">
          <span>Zoom: {Math.round(scale * 100)}%</span>
          <span>Verify InstaPay / Vodafone Cash transaction ID & amount</span>
        </div>
      </div>
    </div>
  );
};
