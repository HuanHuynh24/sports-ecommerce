// app/products/[id]/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen py-8 md:py-12 bg-white dark:bg-[#0a0404]">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
          
          {/* LEFT: GALLERY SKELETON */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-200 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10" />
            
            {/* Thumbnails */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 dark:bg-white/5 rounded-xl" />
              ))}
            </div>
          </div>

          {/* RIGHT: INFO SKELETON */}
          <div className="lg:col-span-5 flex flex-col h-full space-y-6">
            
            {/* Breadcrumb & Title */}
            <div className="space-y-3">
              <div className="h-4 w-32 bg-gray-200 dark:bg-white/5 rounded" />
              <div className="h-10 w-3/4 bg-gray-200 dark:bg-white/5 rounded" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-white/5 rounded" />
            </div>

            {/* Price */}
            <div className="h-12 w-48 bg-gray-200 dark:bg-white/5 rounded" />

            {/* Variants (Attribute Selectors) */}
            <div className="space-y-4">
              <div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-white/5 rounded mb-2" />
                <div className="flex gap-2">
                  <div className="h-10 w-16 bg-gray-200 dark:bg-white/5 rounded-lg" />
                  <div className="h-10 w-16 bg-gray-200 dark:bg-white/5 rounded-lg" />
                </div>
              </div>
              <div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-white/5 rounded mb-2" />
                <div className="flex gap-2">
                  <div className="h-10 w-16 bg-gray-200 dark:bg-white/5 rounded-lg" />
                  <div className="h-10 w-16 bg-gray-200 dark:bg-white/5 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 dark:bg-white/5 rounded-xl" />
              <div className="w-12 h-12 bg-gray-200 dark:bg-white/5 rounded-xl" />
            </div>

            {/* Description */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-white/5 rounded-xl space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-white/5 rounded mb-4" />
              <div className="h-3 w-full bg-gray-200 dark:bg-white/5 rounded" />
              <div className="h-3 w-full bg-gray-200 dark:bg-white/5 rounded" />
              <div className="h-3 w-2/3 bg-gray-200 dark:bg-white/5 rounded" />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}