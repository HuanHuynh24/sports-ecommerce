import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {/* Render 12 ô loading giả lập */}
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden"
        >
          {/* Ảnh giả lập */}
          <div className="aspect-[3/4] w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          
          {/* Text giả lập */}
          <div className="p-3 space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="pt-2 flex justify-between items-center">
               <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}