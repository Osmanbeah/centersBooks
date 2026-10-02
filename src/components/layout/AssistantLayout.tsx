import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Building2, 
  UserCog, 
  BookOpen
} from 'lucide-react';
import { useCenters } from '../../context/CenterContext';

export const AssistantLayout: React.FC = () => {
  const { globalKPIs } = useCenters();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Field Assistant Bar */}
      <div className="bg-indigo-950 text-indigo-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-indigo-900 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
            <UserCog className="w-4 h-4 text-indigo-400" />
            <span>Field Assistant Portal — Stock Drops & Payment Proofs</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-indigo-300">
          <span>{globalKPIs.totalCenters} Centers</span>
          <span className="text-indigo-400">•</span>
          <span>{globalKPIs.totalBooksDistributed} Books Handed Over</span>
          <span className="text-indigo-400">•</span>
          <span>{globalKPIs.totalCodesDistributed} Codes Handed Over</span>
        </div>
      </div>

      {/* Main Assistant Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-slate-900 tracking-tight">
                    Field Assistant Hub
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Field Distribution
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Stock Handover Queue & Direct Payment Collection Proofs
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-semibold">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Quantity Log & Proof Mode</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
    </div>
  );
};
