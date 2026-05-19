import React from "react";

export default function RateCard({ bankName, rate, logo, textColor, bgClass, isDark }) {
  // If rate doesn't exist, we don't render this bank (specifically useful for conditional HNB)
  if (rate === undefined || rate === null) return null;

  return (
    <div
      className={`w-full h-20 rounded-[18px] mb-2.5 flex flex-col p-2.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md select-none ${
        bgClass ? bgClass : "bg-white shadow-[0_0_22px_-4px_rgba(0,0,0,0.08)] border border-gray-50"
      }`}
    >
      <span
        className="w-[91%] text-right font-medium text-[11px] self-end pr-1 truncate tracking-wide"
        style={{ color: isDark ? "rgba(255,255,255,0.7)" : textColor }}
      >
        {bankName}
      </span>
      <div className="flex justify-between items-center mt-0.5">
        <span
          className="font-neutra text-[23px] font-semibold flex items-baseline pl-2 tracking-wide"
          style={{ color: isDark ? "#ffffff" : textColor }}
        >
          <span>{rate}</span>
          <span className="text-[10px] ml-1 font-sans font-medium uppercase tracking-wider opacity-85">
            LKR
          </span>
        </span>
        <div className="w-[30%] flex justify-center items-center pr-2">
          {logo && (
            <img
              src={logo}
              className="w-7 h-7 object-contain select-none pointer-events-none"
              alt={`${bankName} logo`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
