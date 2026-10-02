import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  UserCog, 
  ShieldCheck, 
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { useCenters } from '../../context/CenterContext';

export const AssistantLayout: React.FC = () => {
  const { globalKPIs } = useCenters();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Field Assistant Bar */}
      <div className="bg-indigo-950 text-indigo-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-indigo-900">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white flex items-center gap-1">
            <UserCog className="w-3.5 h-3.5 text-indigo-400" />
            <span>Field Assistant Portal (Drop-offs & Direct Photo Collections)</span>
          </span>
          <span className="text-indigo-700">|</span>
          <button
            onClick={() => navigate('/admin')}
            className="text-[11px] text-teal-300 hover:text-teal-200 underline font-medium flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Switch to Admin Mode</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-indigo-300">
          <span>{globalKPIs.totalCenters} Centers</span>
          <span>{globalKPIs.totalBooksDistributed} Books Handed Over</span>
          <span>{globalKPIs.totalCodesDistributed} Codes Handed Over</span>
        </div>
      </div>

      {/* Main Assistant Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/')}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 hover:opacity-90 transition-opacity"
                title="Return to Portal Gateway"
              >
                <Building2 className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-slate-900 tracking-tight">
                    Field Assistant Hub
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Field View
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Stock Handover Queue & Direct Payment Collection Proofs
                </p>
              </div>
            </div>

            {/* Status indicator & Exit */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-semibold">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Quantity Log Mode Active</span>
              </div>

              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
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
