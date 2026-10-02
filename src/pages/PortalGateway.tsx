import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  UserCog, 
  DollarSign, 
  BookOpen, 
  Truck, 
  Database, 
  Camera, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useCenters } from '../context/CenterContext';

export const PortalGateway: React.FC = () => {
  const navigate = useNavigate();
  const { globalKPIs } = useCenters();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">
                Educational Centers Hub
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                PRO SYSTEM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Books & Codes Logistics & Multi-Stream Financial Settlements
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{globalKPIs.totalCenters} Centers Active</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <span>{globalKPIs.totalBooksDistributed} Books Distributed</span>
          <div className="h-4 w-px bg-slate-800" />
          <span>{globalKPIs.totalCodesDistributed} Codes Handed Over</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-teal-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Workspace to Proceed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Role-Segregated Management for Field & Finance
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Choose your portal. Field assistants manage stock drops and direct photo collections. Admins retain full financial oversight, margins, and settlements.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          {/* Card 1: Admin Portal */}
          <div 
            onClick={() => navigate('/admin')}
            className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/60 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/15 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-300">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Admin Workspace
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-teal-300 transition-colors">
                Financial Administration
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Comprehensive net profit calculations, center price cuts, separate books vs codes accounting, proof-of-payment audit queue, and Supabase cloud sync.
              </p>

              <div className="space-y-2.5 mb-8">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <DollarSign className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Gross vs Center Cut vs Net Owner Revenue</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <BookOpen className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Separated Books (400 EGP) & Codes (250 EGP) Ledgers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Truck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Delivery Auditing & Assistant Leaderboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Database className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Supabase PostgreSQL Integration & Schema</span>
                </div>
              </div>
            </div>

            <button 
              className="w-full py-3.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 group-hover:gap-3"
            >
              <span>Enter Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Assistant Portal */}
          <div 
            onClick={() => navigate('/assistant')}
            className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <UserCog className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Field Assistant
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-indigo-300 transition-colors">
                Assistant Field Portal
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Simple, distraction-free mobile portal for center deliveries, tracking stock handed over, and recording cash or digital collections with direct photo receipt uploads.
              </p>

              <div className="space-y-2.5 mb-8">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Log Stock Drops (Books Only, Codes Only, Both)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Camera className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Direct Photo Upload for InstaPay & Vodafone Cash</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Designate Collection Target (Books, Codes, Both)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Strict Financial Privacy (Zero Price Leaks)</span>
                </div>
              </div>
            </div>

            <button 
              className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 group-hover:gap-3"
            >
              <span>Enter Assistant Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <span>Educational Centers Management & Settlement Engine</span>
        <span>Connected with Supabase Cloud & Local Storage</span>
      </footer>
    </div>
  );
};
