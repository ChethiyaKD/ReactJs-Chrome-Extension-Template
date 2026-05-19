import React from "react";
import settingsIcon from "../assets/images/settings.svg";

export default function Header({ onOpenSettings }) {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-gray-100 select-none">
      <div className="flex flex-col">
        <span className="font-bold text-[17px] text-gray-800 leading-tight">
          Dollar Rates
        </span>
        <span className="text-[12px] text-gray-500 font-medium">
          of Sri Lankan Banks
        </span>
      </div>
      <button
        onClick={onOpenSettings}
        className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
        title="Settings"
      >
        <img
          src={settingsIcon}
          alt="Settings"
          className="w-6 h-6 hover:rotate-45 transition-transform duration-300"
        />
      </button>
    </div>
  );
}
