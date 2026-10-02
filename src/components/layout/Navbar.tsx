import React from 'react';
import { useCenters } from '../../context/CenterContext';
import { 
  Building2, 
  BookOpen, 
  ShieldCheck, 
  UserCog, 
  SlidersHorizontal,
  Sparkles,
  DollarSign,
  Truck
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'admin' | 'admin-deliveries' | 'assistant' | 'settings';
  setCurrentTab: (tab: 'admin' | 'admin-deliveries' | 'assistant' | 'settings') => void;
  currentRole: 'admin' | 'assistant';
  setCurrentRole: (role: 'admin' | 'assistant') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
}) => {
  const { globalKPIs } = useCenters();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Top Role Simulator Bar */}
      <div className="bg-slate-950 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch Role / View:</span>
          </span>

          <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            <button
              onClick={() => {
                setCurrentRole('admin');
                setCurrentTab('admin');
              }}
              className={`px-3 py-0.5 rounded-md font-medium text-[11px] transition-all flex items-center gap-1.5 ${
                currentRole === 'admin'
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin (Full Financial & Pricing Control)</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('assistant');
                setCurrentTab('assistant');
              }}
              className={`px-3 py-0.5 rounded-md font-medium text-[11px] transition-all flex items-center gap-1.5 ${
                currentRole === 'assistant'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Assistant (Quantities & Drops Only — No Prices)</span>
            </button>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          {currentRole === 'admin' && (
            <span className="text-teal-400 font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Net Profit: {globalKPIs.totalOwnerNetProfit.toLocaleString()} EGP</span>
            </span>
          )}
          <span>{globalKPIs.totalCenters} Centers</span>
          <span>{globalKPIs.totalBooksDistributed} Books</span>
          <span>{globalKPIs.totalCodesDistributed} Codes</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 tracking-tight">
                  Educational Centers Hub
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Books & Codes
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Distribution & Financial Settlement Management
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            {currentRole === 'admin' ? (
              <>
                <button
                  onClick={() => setCurrentTab('admin')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentTab === 'admin'
                      ? 'bg-white text-teal-950 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-teal-600" />
                  <span>Financial Settlements</span>
                  {globalKPIs.pendingProofVerifications > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-black">
                      {globalKPIs.pendingProofVerifications}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCurrentTab('admin-deliveries')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentTab === 'admin-deliveries'
                      ? 'bg-white text-indigo-950 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Deliveries & Activity</span>
                </button>

                <button
                  onClick={() => setCurrentTab('settings')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentTab === 'settings'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                  <span>Database Schema</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentTab('assistant')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-xs border border-slate-200"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Assistant Distribution Queue</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
