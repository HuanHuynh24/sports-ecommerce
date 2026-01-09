import React, { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import SortSelect from "@/components/SortSelect";
import ProductListing from "@/components/ProductListing";
import ProductSkeleton from "@/components/ProductSkeleton";

//Interface Props cho Next.js 15
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

//Data tĩnh cho Sidebar (hoặc gọi API riêng nếu cần)
const sidebarDataStub = {
  categories: [
    { value: 1, label: "Vợt cầu lông" },
    { value: 2, label: "Giày cầu lông" },
  ],
    brands: [
    { value: 1, label: "Yonex" },
    { value: 2, label: "Victor" },
    { value: 3, label: "Lining" },
    { value: 4, label: "Mizuno" },
   ],
  priceRanges: [
    { value: "0-1000000", label: "Dưới 1 triệu" },
    { value: "1000000-3000000", label: "1 - 3 triệu" },
    { value: "3000000-5000000", label: "3 - 5 triệu" },
    { value: "5000000-100000000", label: "Trên 5 triệu" },
  ],
};

export default async function ProductPage(props: PageProps) {
  //1. Await searchParams (Bắt buộc ở Next 15)
  const searchParams = await props.searchParams;

  //2. Helper lấy param
  const getParam = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  //3. Xử lý logic Params
  let minPriceAPI = undefined;
  let maxPriceAPI = undefined;
  const priceRange = getParam("price_range");

  if (priceRange && priceRange.includes("-")) {
    const [min, max] = priceRange.split("-");
    minPriceAPI = Number(min);
    maxPriceAPI = Number(max);
  }

  //4. Tạo Object Query API
  const apiQuery = {
    category_id: 2,
    page: Number(getParam("page")) || 1,
    limit: 12,
    sort_by: getParam("sort") || "newest",
    brand_id: getParam("brand") ? Number(getParam("brand")) : undefined,
    min_price: minPriceAPI,
    max_price: maxPriceAPI,
    keyword: getParam("keyword") || undefined,
  };

  //5. 🔥 TẠO KEY CHO SUSPENSE
  //Key thay đổi -> Suspense destroy component cũ -> Hiện Skeleton -> Mount component mới
  const suspenseKey = JSON.stringify(apiQuery);

  //6. Data cho Sidebar UI
  const ensureArray = (value: string | string[] | undefined) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };
  const currentFilters = {
    brands: getParam("brand") ? [Number(getParam("brand"))] : [],
    priceRanges: ensureArray(searchParams.price_range),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0404]">
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR (Giữ nguyên, không reload) --- */}
          <div className="hidden lg:block w-64 shrink-0">
            <Sidebar data={sidebarDataStub} initialFilters={currentFilters} />
          </div>

          {/* --- MAIN CONTENT --- */}
          <div className="flex-1 w-full lg:w-[calc(100%-256px)]">
            
            {/* Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/10">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 sm:mb-0">
                Danh sách sản phẩm
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sắp xếp:
                </span>
                <SortSelect />
              </div>
            </div>

            {/* 🔥 SUSPENSE BOUNDARY: Khu vực Loading cục bộ */}
            <Suspense key={suspenseKey} fallback={<ProductSkeleton />}>
              <ProductListing apiQuery={apiQuery} />
            </Suspense>

          </div>
        </div>
      </main>
    </div>
  );
}