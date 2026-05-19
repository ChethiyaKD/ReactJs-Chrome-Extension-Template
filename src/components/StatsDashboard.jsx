import React from "react";

export default function StatsDashboard({ stats, activeTab }) {
  if (!stats) return null;

  return (
    <div className="px-4 py-1 flex gap-2 select-none w-full box-border">
      {/* Average Rate Card */}
      <div className="flex-1 bg-white border border-gray-100/80 rounded-xl p-1.5 flex items-center gap-1.5 shadow-[0_1.5px_4px_rgba(0,0,0,0.01)] hover:shadow-sm transition-shadow min-w-0">
        <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5 shrink-0">
            Average
          </span>
          <span className="text-[10.5px] font-bold text-gray-700 leading-none truncate">
            {stats.average} <span className="text-[7.5px] font-medium text-gray-500">LKR</span>
          </span>
        </div>
      </div>

      {/* Best Deal Card */}
      <div className="flex-1 bg-white border border-gray-100/80 rounded-xl p-1.5 flex items-center gap-1.5 shadow-[0_1.5px_4px_rgba(0,0,0,0.01)] hover:shadow-sm transition-shadow min-w-0">
        <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5 shrink-0">
            {activeTab === "selling" ? "Best Buy" : "Best Sell"}
          </span>
          <span className="text-[10.5px] font-bold text-emerald-600 leading-none truncate" title={stats.bestName}>
            {stats.bestName}
          </span>
        </div>
      </div>
    </div>
  );
}
