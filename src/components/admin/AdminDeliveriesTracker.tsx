import React, { useState, useMemo } from 'react';
import { useCenters } from '../../context/CenterContext';
import { 
  BookOpen, 
  KeyRound, 
  Search, 
  Calendar, 
  User, 
  MapPin, 
  Building2, 
  Truck, 
  Trash2,
  TrendingUp
} from 'lucide-react';

export const AdminDeliveriesTracker: React.FC = () => {
  const { distributions, deleteDistribution, centers } = useCenters();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAssistant, setSelectedAssistant] = useState<string>('all');
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'books' | 'codes'>('all');

  // Extract unique assistants
  const uniqueAssistants = useMemo(() => {
    const names = new Set<string>();
    distributions.forEach(d => {
      if (d.assistant_name) names.add(d.assistant_name);
    });
    return Array.from(names);
  }, [distributions]);

  // Filtered distributions
  const filteredDistributions = useMemo(() => {
    return distributions.filter(d => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          d.center_name.toLowerCase().includes(q) ||
          d.assistant_name.toLowerCase().includes(q) ||
          (d.notes && d.notes.toLowerCase().includes(q)) ||
          d.distribution_date.includes(q);
        if (!matchesQuery) return false;
      }

      // Assistant filter
      if (selectedAssistant !== 'all' && d.assistant_name !== selectedAssistant) {
        return false;
      }

      // Center filter
      if (selectedCenter !== 'all' && d.center_id !== selectedCenter) {
        return false;
      }

      // Item type filter
      if (filterType === 'books' && d.books_count === 0) return false;
      if (filterType === 'codes' && d.codes_count === 0) return false;

      return true;
    });
  }, [distributions, searchQuery, selectedAssistant, selectedCenter, filterType]);

  // Aggregations
  const totalBooksLogged = useMemo(() => distributions.reduce((sum, d) => sum + d.books_count, 0), [distributions]);
  const totalCodesLogged = useMemo(() => distributions.reduce((sum, d) => sum + d.codes_count, 0), [distributions]);

  // Assistant Leaderboard
  const assistantStats = useMemo(() => {
    const statsMap: Record<string, { drops: number; books: number; codes: number }> = {};
    distributions.forEach(d => {
      const name = d.assistant_name || 'Unknown Assistant';
      if (!statsMap[name]) {
        statsMap[name] = { drops: 0, books: 0, codes: 0 };
      }
      statsMap[name].drops += 1;
      statsMap[name].books += d.books_count;
      statsMap[name].codes += d.codes_count;
    });
    return Object.entries(statsMap).map(([name, data]) => ({ name, ...data }));
  }, [distributions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Field Deliveries & Assistant Activity Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
              Audit Trail
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete transparency: Track which assistant dropped books and codes, quantities delivered, handover dates, and batch notes.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Delivery Trips</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{distributions.length}</p>
            <p className="text-xs text-slate-400 mt-1">Logged drop-off events</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-2xs flex items-center justify-between bg-teal-50/20">
          <div>
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">Total Books Delivered</p>
            <p className="text-2xl sm:text-3xl font-black text-teal-800 mt-1">{totalBooksLogged.toLocaleString()} <span className="text-xs font-normal text-slate-500">copies</span></p>
            <p className="text-xs text-slate-400 mt-1">Across all centers</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-100 text-teal-700">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs flex items-center justify-between bg-indigo-50/20">
          <div>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Total Codes Delivered</p>
            <p className="text-2xl sm:text-3xl font-black text-indigo-800 mt-1">{totalCodesLogged.toLocaleString()} <span className="text-xs font-normal text-slate-500">cards</span></p>
            <p className="text-xs text-slate-400 mt-1">Platform activation credentials</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Assistant Activity Summary Cards */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-black">Assistant Field Performance Breakdown</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assistantStats.map((ast, idx) => (
            <div key={idx} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                    {ast.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{ast.name}</h4>
                    <p className="text-[11px] text-slate-400">{ast.drops} Handover trips</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-xs">
                <div className="bg-slate-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-teal-300 block font-bold">Books Handed</span>
                  <span className="text-base font-black text-white">{ast.books.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-indigo-300 block font-bold">Codes Handed</span>
                  <span className="text-base font-black text-white">{ast.codes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar & Deliveries Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Truck className="w-5 h-5 text-teal-600" />
              <span>All Delivery Records ({filteredDistributions.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Detailed audit trail of physical drop-offs and platform codes distribution.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search center, notes..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-teal-500"
              />
            </div>

            {/* Assistant Filter */}
            <select
              value={selectedAssistant}
              onChange={e => setSelectedAssistant(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
            >
              <option value="all">All Assistants</option>
              {uniqueAssistants.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            {/* Center Filter */}
            <select
              value={selectedCenter}
              onChange={e => setSelectedCenter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
            >
              <option value="all">All Centers</option>
              {centers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Type Filter Tabs */}
            <div className="inline-flex bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('books')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'books' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Books
              </button>
              <button
                onClick={() => setFilterType('codes')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'codes' ? 'bg-white text-indigo-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Codes
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Center & Location</th>
                <th className="py-3.5 px-4">Delivered By (Assistant)</th>
                <th className="py-3.5 px-4 text-teal-800">Books Handed</th>
                <th className="py-3.5 px-4 text-indigo-800">Codes Handed</th>
                <th className="py-3.5 px-4">Handover Date</th>
                <th className="py-3.5 px-4">Batch Details & Notes</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredDistributions.map(d => {
                const centerObj = centers.find(c => c.id === d.center_id);

                return (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Center */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-extrabold text-slate-900">{d.center_name}</p>
                          {centerObj && (
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 font-normal mt-0.5">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              <span>{centerObj.city}, {centerObj.governorate}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Delivered By */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 font-bold text-slate-800 text-xs border border-slate-200">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{d.assistant_name}</span>
                      </div>
                    </td>

                    {/* Books Handed */}
                    <td className="py-3.5 px-4">
                      {d.books_count > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 text-teal-900 font-black text-xs border border-teal-200">
                          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                          <span>{d.books_count} Books</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">0 Books</span>
                      )}
                    </td>

                    {/* Codes Handed */}
                    <td className="py-3.5 px-4">
                      {d.codes_count > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-900 font-black text-xs border border-indigo-200">
                          <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{d.codes_count} Codes</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">0 Codes</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{d.distribution_date}</span>
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {d.notes ? (
                        <p className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 font-mono text-[11px] leading-relaxed">
                          {d.notes}
                        </p>
                      ) : (
                        <span className="text-slate-400 italic">No notes provided</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Remove distribution record for ${d.center_name}?`)) {
                            deleteDistribution(d.id);
                          }
                        }}
                        title="Delete record"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
