import React from "react";

import googleLogo from "./assets/images/google.png";
import combankLogo from "./assets/images/combank.png";
import ntbLogo from "./assets/images/ntb.png";
import hnbLogo from "./assets/images/hnb.png";
import sampathLogo from "./assets/images/sampath.png";
import seylanLogo from "./assets/images/seylan.png";
import bocLogo from "./assets/images/boc.png";

const cbslLogoSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[11px] h-[11px] text-amber-600/90"
  >
    <path d="M3 22h18" />
    <path d="M6 22V11M18 22V11" />
    <path d="M12 22V11" />
    <path d="M9 22V11M15 22V11" />
    <path d="M2 11h20L12 4z" />
  </svg>
);

const defaultMockRates = {
  google: "305.50",
  cbsl: "302.25",
  cbsl_buy: "291.10",
  ComBank: "303.00",
  ComBank_Buy: "292.00",
  BOC: "304.00",
  BOC_Buy: "293.00",
  NTB: "305.00",
  NTB_Buy: "294.00",
  Seylan: "301.50",
  Seylan_Buy: "295.50",
  Sampath: "303.75",
  Sampath_Buy: "292.50",
  hnb: "304.25",
  hnb_buy: "293.25",
};

const banksConfig = [
  {
    id: "google",
    name: "Google Finance",
    sellKey: "google",
    buyKey: "google",
    logo: googleLogo,
  },
  {
    id: "cbsl",
    name: "Central Bank (CBSL)",
    sellKey: "cbsl",
    buyKey: "cbsl_buy",
    logoSvg: cbslLogoSvg,
  },
  {
    id: "BOC",
    name: "Bank of Ceylon (BOC)",
    sellKey: "BOC",
    buyKey: "BOC_Buy",
    logo: bocLogo,
  },
  {
    id: "ComBank",
    name: "Commercial Bank",
    sellKey: "ComBank",
    buyKey: "ComBank_Buy",
    logo: combankLogo,
  },
  {
    id: "hnb",
    name: "Hatton National (HNB)",
    sellKey: "hnb",
    buyKey: "hnb_buy",
    logo: hnbLogo,
  },
  {
    id: "Sampath",
    name: "Sampath Bank",
    sellKey: "Sampath",
    buyKey: "Sampath_Buy",
    logo: sampathLogo,
  },
  {
    id: "Seylan",
    name: "Seylan Bank",
    sellKey: "Seylan",
    buyKey: "Seylan_Buy",
    logo: seylanLogo,
  },
  {
    id: "NTB",
    name: "Nations Trust (NTB)",
    sellKey: "NTB",
    buyKey: "NTB_Buy",
    logo: ntbLogo,
  },
];

export default function App({ amount = 1.0, rates = {}, onClose }) {
  // Safe rate lookup with direct fallback
  const getRate = (key) => parseFloat(rates[key] || defaultMockRates[key]) || 0;

  // Process rows with converted amounts
  const rows = banksConfig.map((bank) => {
    const buyRate = getRate(bank.buyKey);
    const sellRate = getRate(bank.sellKey);

    return {
      ...bank,
      buyRate,
      sellRate,
      totalBuyLkr: amount * buyRate,
      totalSellLkr: amount * sellRate,
    };
  });

  // Find the absolute BEST buying and selling rates
  const exchangeableRows = rows.filter(
    (r) => r.id !== "google" && r.id !== "cbsl",
  );

  const maxBuyRate = Math.max(...exchangeableRows.map((r) => r.buyRate));
  const minSellRate = Math.min(...exchangeableRows.map((r) => r.sellRate));

  const formatLkr = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatUsd = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getExtensionUrl = (path) => {
    if (!path) return "";
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.getURL
    ) {
      return chrome.runtime.getURL(
        `assets/images/${path.split("/assets/images/")[1]}`,
      );
    }
    return path;
  };

  return (
    <div className="w-full h-full bg-[#F8FAFC] border border-gray-100 shadow-[0_20px_50px_rgba(10,15,29,0.18)] rounded-[24px] p-4 flex flex-col font-sans select-none overflow-hidden animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
            <span className="text-[17px]">💸</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="font-black text-[13px] text-gray-800 tracking-wider uppercase">
              USD to LKR Conversion
            </h3>
            <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider">
              Converting ${formatUsd(amount)} USD
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-200/50 transition-colors focus:outline-none border border-transparent hover:border-gray-200/30"
          title="Close Conversion Panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Grid Sub-Header */}
      <div className="grid grid-cols-2 px-3.5 mb-2.5 text-[9px] font-black uppercase text-gray-400 tracking-widest shrink-0">
        <span>YOU RECEIVE (BUY)</span>
        <span className="text-right">YOU PAY (SELL)</span>
      </div>

      {/* Conversion Cards List */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 custom-scrollbar">
        {rows.map((row) => {
          const isBestBuy =
            row.buyRate === maxBuyRate &&
            row.id !== "google" &&
            row.id !== "cbsl";
          const isBestSell =
            row.sellRate === minSellRate &&
            row.id !== "google" &&
            row.id !== "cbsl";

          const cardStyles = isBestBuy
            ? "bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200/80 shadow-[0_4px_16px_rgba(16,185,129,0.06)] hover:scale-[1.01]"
            : isBestSell
              ? "bg-gradient-to-br from-amber-50/70 to-yellow-50/50 border border-amber-200/80 shadow-[0_4px_16px_rgba(245,158,11,0.06)] hover:scale-[1.01]"
              : "bg-white border border-gray-100 hover:border-gray-200 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:scale-[1.01]";

          return (
            <div
              key={row.id}
              className={`w-full h-[78px] rounded-[18px] flex flex-col p-3 justify-between transition-all duration-300 ${cardStyles}`}
            >
              {/* Top Row: Logo & Bank Name (Left) & Deal Badge (Right) */}
              <div className="flex justify-between items-center w-full min-w-0 gap-1.5 leading-none mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Logo Container */}
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 rounded-md bg-white border border-gray-100/60 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    {row.logoSvg ? (
                      <div className="flex items-center justify-center select-none pointer-events-none scale-[0.85]">
                        {row.logoSvg}
                      </div>
                    ) : (
                      <img
                        src={getExtensionUrl(row.logo)}
                        className="w-[14px] h-[14px] object-contain select-none pointer-events-none"
                        alt={`${row.name} logo`}
                      />
                    )}
                  </div>
                  {/* Bank Name */}
                  <span className="font-extrabold text-[11px] text-gray-700 truncate tracking-wide">
                    {row.name
                      .replace(" Bank", "")
                      .replace(" (BOC)", "")
                      .replace(" (HNB)", "")
                      .replace(" (NTB)", "")
                      .replace(" (CBSL)", "")}
                  </span>
                </div>

                {/* Deal Badge */}
                {isBestBuy ? (
                  <span className="flex items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[#059669] text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                    Best Payout
                  </span>
                ) : isBestSell ? (
                  <span className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0">
                    <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                    Best Cost
                  </span>
                ) : (
                  <div />
                )}
              </div>

              {/* Bottom Row: Buy Amount (Left) & Sell Amount (Right) */}
              <div className="flex justify-between items-baseline mb-0.5">
                {/* Left Section: Buy rates */}
                <div className="flex flex-col items-start leading-none gap-1">
                  <span
                    className={`text-[15px] font-black tracking-wide ${isBestBuy ? "text-[#047857]" : "text-gray-800"}`}
                  >
                    Rs. {formatLkr(row.totalBuyLkr)}
                  </span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                    Buy @ {row.buyRate.toFixed(2)}
                  </span>
                </div>

                {/* Right Section: Sell rates */}
                <div className="flex flex-col items-end leading-none gap-1">
                  <span
                    className={`text-[15px] font-black tracking-wide ${isBestSell ? "text-[#b45309]" : "text-gray-800"}`}
                  >
                    Rs. {formatLkr(row.totalSellLkr)}
                  </span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                    Sell @ {row.sellRate.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Indicators */}
      <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[8px] font-extrabold text-gray-400 uppercase tracking-widest shrink-0">
        <span>⭐ HIGHEST RETURN</span>
        <span>🔥 LOWEST COST</span>
      </div>
    </div>
  );
}
