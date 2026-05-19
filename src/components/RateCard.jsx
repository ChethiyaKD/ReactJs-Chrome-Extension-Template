import React from "react";

export default function RateCard({
  bankName,
  rate,
  logo,
  logoSvg,
  textColor,
  bgClass,
  isDark,
  isBest,
  isGold,
}) {
  if (rate === undefined || rate === null) return null;

  const cardStyles = isDark
    ? "bg-[#2c2c2c] text-white shadow-md border border-zinc-800"
    : isGold
    ? "bg-gradient-to-br from-amber-50/90 to-yellow-50/70 border border-amber-200/80 shadow-sm"
    : isBest
    ? "bg-white shadow-[0_4px_16px_rgba(16,185,129,0.06)] border border-[#10b981]/25 hover:border-[#10b981]/40"
    : "bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] border border-gray-100/90 hover:border-gray-200";

  const nameColor = isDark
    ? "text-zinc-400"
    : isGold
    ? "text-amber-800/80"
    : isBest
    ? "text-emerald-800/80"
    : textColor;

  return (
    <div
      className={`w-full h-[74px] rounded-[16px] flex flex-col p-2.5 justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md select-none ${cardStyles}`}
    >
      {/* Top row: Badge (Left) & Name (Right) */}
      <div className="flex justify-between items-center w-full min-w-0 mb-1 gap-1">
        {isBest ? (
          <span className="flex items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[#059669] text-[7.5px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md leading-none shrink-0 shadow-sm">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
            Best Rate
          </span>
        ) : isGold ? (
          <span className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[7.5px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md leading-none shrink-0 shadow-sm">
            Regulatory
          </span>
        ) : (
          <div />
        )}
        <span
          className="font-bold text-[9.5px] truncate tracking-wide pr-0.5 min-w-0 text-right flex-1"
          style={{ color: !isBest && !isGold ? nameColor : undefined }}
        >
          {bankName}
        </span>
      </div>

      {/* Bottom row: Rate (Left) & Icon (Right) */}
      <div className="flex justify-between items-center mb-0.5">
        <span
          className="font-neutra text-[20px] font-bold flex items-baseline pl-1 tracking-wide leading-none shrink-0"
          style={{ color: isDark ? "#ffffff" : isGold ? "#b45309" : isBest ? "#047857" : textColor }}
        >
          <span>{rate}</span>
          <span className="text-[8px] ml-0.5 font-sans font-semibold uppercase tracking-wider opacity-75">
            LKR
          </span>
        </span>

        <div className="w-7 h-7 flex items-center justify-end shrink-0">
          {logoSvg ? (
            <div className="flex items-center justify-center select-none pointer-events-none text-amber-600">
              {logoSvg}
            </div>
          ) : (
            <img
              src={logo}
              className="w-7 h-7 object-contain select-none pointer-events-none filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.02)]"
              alt={`${bankName} logo`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
