import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="w-full flex flex-col gap-2.5 select-none animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-full h-20 rounded-[18px] bg-white border border-gray-100 flex flex-col p-2.5 justify-between"
        >
          <div className="w-24 h-3 bg-gray-200 rounded self-end mr-1 mt-1"></div>
          <div className="flex justify-between items-center mb-1">
            <div className="w-20 h-6 bg-gray-200 rounded ml-2"></div>
            <div className="w-7 h-7 bg-gray-200 rounded-full mr-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
