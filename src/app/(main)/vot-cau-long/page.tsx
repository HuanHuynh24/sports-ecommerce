"use client";
import React, { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

import type { FilterState } from "@/types/types";
import { SortOption } from "@/types/types";

import { PRODUCTS, CATEGORIES, DISCOUNTS, PRICE_RANGES, BRANDS } from "@/data/constants";
import HeaderServer from "@/components/header/HeaderServer";

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    discounts: [],
    priceRanges: [],
    brands: [],
  });

  const [sortBy, setSortBy] = useState<SortOption>(SortOption.Featured);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // category (enum)
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // discount
    if (filters.discounts.length > 0) {
      result = result.filter((p) =>
        filters.discounts.some((d) => (p.discount ?? 0) >= d)
      );
    }

    // brands
    if (filters.brands && filters.brands.length > 0) {
      result = result.filter((p) => filters.brands!.includes(p.brand));
    }

    // priceRanges: demo (chưa parse min/max) -> để sau

    switch (sortBy) {
      case SortOption.PriceAsc:
        result.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case SortOption.PriceDesc:
        result.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      default:
        break;
    }

    return result;
  }, [filters, sortBy]);

  const resetFilters = () =>
    setFilters({ categories: [], discounts: [], priceRanges: [], brands: [] });

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar
            filters={filters}
            setFilters={setFilters}
            data={{
              categories: CATEGORIES, // ✅ CHỈ CẦN TRUYỀN THẲNG
              discounts: DISCOUNTS,
              priceRanges: PRICE_RANGES.map((x) => ({ value: x, label: x })),
              brands: BRANDS.map((b) => ({ value: b, label: b })),
            }}
          />

          <div className="flex-1 flex flex-col w-full min-w-0">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-[#f3e7e7] shadow-sm gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 font-medium">Sắp xếp theo:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border-none bg-[#f8f6f6] rounded px-3 py-1.5 text-sm font-semibold text-[#1b0d0d] focus:ring-0 cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    {Object.values(SortOption).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>
                    Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-400 flex flex-col items-center">
                  <span className="material-symbols-outlined text-6xl mb-4">
                    search_off
                  </span>
                  <p className="text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-primary font-bold hover:underline"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}
            </div>

            {/* Pagination demo */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-auto pb-10">
                <nav className="flex items-center gap-1">
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e7cfcf] bg-white text-gray-600 hover:bg-[#f3e7e7] transition-colors disabled:opacity-50">
                    <span className="material-symbols-outlined text-sm">
                      chevron_left
                    </span>
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold shadow-md">
                    1
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e7cfcf] bg-white text-[#1b0d0d] font-medium hover:bg-[#f3e7e7] hover:text-primary transition-colors">
                    2
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e7cfcf] bg-white text-[#1b0d0d] font-medium hover:bg-[#f3e7e7] hover:text-primary transition-colors">
                    3
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent bg-transparent text-gray-400 font-medium">
                    ...
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e7cfcf] bg-white text-[#1b0d0d] font-medium hover:bg-[#f3e7e7] hover:text-primary transition-colors">
                    12
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e7cfcf] bg-white text-gray-600 hover:bg-[#f3e7e7] transition-colors">
                    <span className="material-symbols-outlined text-sm">
                      chevron_right
                    </span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
};

export default App;
