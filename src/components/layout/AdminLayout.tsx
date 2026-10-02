import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  Truck, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useCenters } from '../../context/CenterContext';

export const AdminLayout: React.FC = () => {
  const { globalKPIs } = useCenters();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Admin Topbar */}
      <div className="bg-slate-950 text-slate-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-semibold text-teal-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Admin Control Room (Full Financial Authority & Pricing Control)</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="text-teal-400 font-bold flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Net Profit: {globalKPIs.totalOwnerNetProfit.toLocaleString()} EGP</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>{globalKPIs.totalCenters} Centers</span>
          <span className="text-slate-600">•</span>
          <span>{globalKPIs.totalBooksDistributed} Books</span>
          <span className="text-slate-600">•</span>
          <span>{globalKPIs.totalCodesDistributed} Codes</span>
        </div>
      </div>

      {/* Main Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-slate-900 tracking-tight">
                    Admin Financial Hub
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Admin Only
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Settlements, Pricing Cuts, Margin Audits & Cloud Database
                </p>
              </div>
            </div>

            {/* Admin Nav Tabs */}
            <nav className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-teal-950 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                <DollarSign className="w-4 h-4 text-teal-600" />
                <span>Financial Settlements</span>
                {globalKPIs.pendingProofVerifications > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-black">
                    {globalKPIs.pendingProofVerifications}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/deliveries"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-950 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Deliveries & Activity</span>
              </NavLink>

              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                <span>Supabase Database</span>
              </NavLink>
            </nav>

            {/* External quick link to Assistant field link */}
            <a
              href="/assistant"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
              title="Open Assistant link in new tab"
            >
              <span>Assistant Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
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
