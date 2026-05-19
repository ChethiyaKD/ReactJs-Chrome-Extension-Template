import React from "react";
import settingsIcon from "../assets/images/material-symbols_settings-rounded.svg";
import notificationsIcon from "../assets/images/si_notifications-alt-fill.svg";
import pinIcon from "../assets/images/tabler_pin-filled.svg";

export default function SettingsModal({
  isOpen,
  onClose,
  notifications,
  onToggleNotifications,
  badgeSource,
  onChangeBadgeSource,
  badgeType,
  onChangeBadgeType,
}) {
  return (
    <div
      className={`absolute inset-0 z-[999] bg-[#F8FAFC] flex flex-col justify-start px-6 py-5 select-none transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <img
              src={settingsIcon}
              alt="Settings Icon"
              className="w-[18px] h-[18px] opacity-80"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="font-black text-[13px] text-gray-800 tracking-wider uppercase">
              Settings Preferences
            </h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
              Customize Extension Core
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-200/50 transition-colors focus:outline-none border border-transparent hover:border-gray-200/30"
          title="Close Settings"
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

      {/* Settings Options Wrapper */}
      <div className="flex flex-col gap-4 w-full">
        {/* Notifications Card */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-4 flex justify-between items-center hover:border-gray-200 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.012)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <img
                src={notificationsIcon}
                alt="Notifications Icon"
                className="w-5 h-5 opacity-80"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-extrabold text-[13.5px] text-gray-800 tracking-tight">
                Push Notifications
              </span>
              <span className="text-gray-400 text-[10.5px] font-medium leading-tight">
                Alert me when rates fluctuate
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => onToggleNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-[42px] h-[24px] bg-gray-200/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-[#1a1a1a]"></div>
          </label>
        </div>

        {/* Badge Setting Card */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-4 flex flex-col gap-4 hover:border-gray-200 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.012)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <img
                src={pinIcon}
                alt="Pin Icon"
                className="w-5 h-5 opacity-80"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-extrabold text-[13.5px] text-gray-800 tracking-tight">
                Display on Toolbar Badge
              </span>
              <span className="text-gray-400 text-[10.5px] font-medium leading-tight">
                Choose what rate value to pin to the extension icon
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 w-full bg-gray-50/50 p-2 rounded-[16px] border border-gray-100/50">
            {/* Custom Styled Select Dropdown */}
            <div className="relative flex-1 min-w-0">
              <select
                value={badgeSource}
                onChange={(e) => onChangeBadgeSource(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-3 py-1.5 pr-7 text-[12.5px] font-bold focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all select-none cursor-pointer appearance-none min-w-0 shadow-sm"
              >
                <option value="average">Average Rate (All Banks)</option>
                <option value="google">Google Finance</option>
                <option value="cbsl">Central Bank of Sri Lanka</option>
                <option value="ComBank">Commercial Bank</option>
                <option value="BOC">Bank of Ceylon (BOC)</option>
                <option value="hnb">Hatton National Bank</option>
                <option value="Sampath">Sampath Bank</option>
                <option value="Seylan">Seylan Bank</option>
                <option value="NTB">Nations Trust Bank</option>
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Segmented Sell/Buy Switcher */}
            <div className="flex bg-gray-200/60 p-0.5 rounded-xl border border-gray-200/20 shrink-0 select-none">
              <button
                onClick={() => onChangeBadgeType("selling")}
                className={`w-[44px] py-1.5 text-[10px] font-black rounded-lg transition-all duration-200 focus:outline-none select-none uppercase tracking-wider ${
                  badgeType === "selling"
                    ? "bg-[#1a1a1a] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="Pin Selling Rate"
              >
                Sell
              </button>
              <button
                onClick={() => onChangeBadgeType("buying")}
                className={`w-[44px] py-1.5 text-[10px] font-black rounded-lg transition-all duration-200 focus:outline-none select-none uppercase tracking-wider ${
                  badgeType === "buying"
                    ? "bg-[#1a1a1a] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="Pin Buying Rate"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
