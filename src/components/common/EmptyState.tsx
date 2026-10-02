import React from 'react';
import { PackageOpen, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onResetFilters?: () => void;
  message?: string;
  subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  onResetFilters, 
  message = "No records found",
  subMessage = "Try adjusting your search criteria, switching governorates, or resetting active filters."
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-2xs my-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 ring-8 ring-slate-50">
        <PackageOpen className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">
        {message}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        {subMessage}
      </p>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};

