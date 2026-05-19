import React from "react";
import closeIcon from "../assets/images/close.svg";

export default function SettingsModal({ isOpen, onClose, notifications, onToggleNotifications }) {
  return (
    <div
      className={`absolute inset-0 z-[999] flex flex-col justify-center items-center bg-white/70 backdrop-blur-[8px] transition-all duration-300 select-none ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200/50 transition-colors focus:outline-none"
        title="Close Settings"
      >
        <img src={closeIcon} alt="Close" className="w-6 h-6" />
      </button>

      {/* Settings Container */}
      <div className="w-[210px] h-[350px] flex flex-col justify-start gap-3 mt-10">
        <h3 className="font-bold text-[16px] text-gray-800 px-1 border-b border-gray-100 pb-2">
          Settings
        </h3>
        
        <div className="bg-white shadow-[0_4px_36px_rgba(53,54,54,0.06)] border border-gray-50 rounded-xl h-[60px] flex justify-between items-center px-4 hover:shadow-md transition-shadow">
          <span className="font-semibold text-sm text-gray-700">
            Notifications
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => onToggleNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-[36px] h-[20px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:bg-[#2c2c2c]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
