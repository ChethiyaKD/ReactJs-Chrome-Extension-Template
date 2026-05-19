import React from "react";
import settingsIcon from "../assets/images/settings.svg";

export default function Header({ onOpenSettings }) {
  return (
    <div className="flex justify-between items-center px-4 py-1 bg-white border-b border-gray-100 select-none">
      <div className="flex flex-col">
        <span className="font-bold text-[15px] text-gray-800 leading-tight">
          Dollar Rates
        </span>
        <span className="text-[10px] text-gray-500 font-medium">
          of Sri Lankan Banks
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-amber-500 hover:text-amber-600 text-[10.5px] font-semibold tracking-wider uppercase transition-colors duration-200 no-underline cursor-pointer select-none"
        >
          <span>⭐</span>
          <span>Rate us</span>
        </a>

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-full hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
          title="Settings"
        >
          <img
            src={settingsIcon}
            alt="Settings"
            className="w-5.5 h-5.5 hover:rotate-45 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  );
}
