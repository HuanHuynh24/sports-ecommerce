import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0404]">
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SKELETON SIDEBAR (Trái) --- */}
          <div className="hidden lg:block w-64 shrink-0 space-y-8">
            {/* Giả lập các block filter */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-3">
                <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* --- SKELETON MAIN CONTENT (Phải) --- */}
          <div className="flex-1 w-full lg:w-[calc(100%-256px)]">
            
            {/* Skeleton Toolbar (Top) */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/10">
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 sm:mb-0" />
              <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Skeleton Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {/* Tạo 12 ô loading giả lập sản phẩm */}
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden"
                >
                  {/* Ảnh sản phẩm */}
                  <div className="aspect-[3/4] w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  
                  {/* Thông tin bên dưới */}
                  <div className="p-3 space-y-2">
                    {/* Tên SP */}
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    
                    {/* Giá tiền */}
                    <div className="pt-2 flex justify-between items-center">
                       <div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                       <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 