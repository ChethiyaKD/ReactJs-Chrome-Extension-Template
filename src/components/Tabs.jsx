import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center py-1 bg-[#f4f7fc] select-none">
      <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
        <button
          onClick={() => setActiveTab("selling")}
          className={`px-6 py-1 text-xs font-semibold rounded-full uppercase tracking-wider transition-all duration-300 focus:outline-none ${
            activeTab === "selling"
              ? "bg-[#3f3f3f] text-white shadow-sm"
              : "text-[#424242] hover:bg-gray-100"
          }`}
        >
          Selling
        </button>
        <button
          onClick={() => setActiveTab("buying")}
          className={`px-6 py-1 text-xs font-semibold rounded-full uppercase tracking-wider transition-all duration-300 focus:outline-none ${
            activeTab === "buying"
              ? "bg-[#3f3f3f] text-white shadow-sm"
              : "text-[#424242] hover:bg-gray-100"
          }`}
        >
          Buying
        </button>
      </div>
    </div>
  );
}
