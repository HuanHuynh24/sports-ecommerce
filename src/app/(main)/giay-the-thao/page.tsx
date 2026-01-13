import React, { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import SortSelect from "@/components/SortSelect";
import ProductListing from "@/components/ProductListing";
import ProductSkeleton from "@/components/ProductSkeleton";
import { productService } from "@/services/product.service"; // Import service

// Interface Props cho Next.js 15
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Hàm helper để fetch data cho Sidebar (Chạy ở Server)
async function getSidebarData() {
  try {
    // 1. Gọi song song API
    const [brandsRes, categoriesRes] = await Promise.all([
      productService.getBrands(),
      productService.getCategories(),
    ]);

    // LOG kiểm tra (như bạn đã làm)
    // console.log("Dữ liệu brands:", brandsRes);

    // 2. Map dữ liệu
    // SỬA ĐỔI: Map trực tiếp từ brandsRes (vì nó là Array), bỏ .data
    const formattedBrands = Array.isArray(brandsRes) 
      ? brandsRes.map((brand: any) => ({
          value: brand.id,
          label: brand.name,
        }))
      : [];

    // Tương tự với Categories (Kiểm tra nếu log category cũng là mảng thì làm y hệt)
    const formattedCategories = Array.isArray(categoriesRes)
      ? categoriesRes.map((cat: any) => ({
          value: cat.id,
          label: cat.name,
        }))
      : [];

    // 3. Price Ranges (Tĩnh)
    const staticPriceRanges = [
      { value: "0-1000000", label: "Dưới 1 triệu" },
      { value: "1000000-3000000", label: "1 - 3 triệu" },
      { value: "3000000-5000000", label: "3 - 5 triệu" },
      { value: "5000000-100000000", label: "Trên 5 triệu" },
    ];

    return {
      brands: formattedBrands,
      categories: formattedCategories,
      priceRanges: staticPriceRanges,
    };
  } catch (error) {
    console.error("Failed to fetch sidebar data:", error);
    return {
      brands: [],
      categories: [],
      priceRanges: [],
    };
  }
}

export default async function ProductPage(props: PageProps) {
  // 1. Await searchParams (Bắt buộc ở Next 15)
  const searchParams = await props.searchParams;

  // 2. Fetch Sidebar Data (Gọi ngay đầu hàm component)
  const sidebarData = await getSidebarData();

  // 3. Helper lấy param
  const getParam = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  // 4. Xử lý logic Params
  let minPriceAPI = undefined;
  let maxPriceAPI = undefined;
  const priceRange = getParam("price_range");

  if (priceRange && priceRange.includes("-")) {
    const [min, max] = priceRange.split("-");
    minPriceAPI = Number(min);
    maxPriceAPI = Number(max);
  }

  // 5. Tạo Object Query API cho ProductListing
  const apiQuery = {
    category_id: 2, // Có thể cần sửa dynamic theo context
    page: Number(getParam("page")) || 1,
    limit: 12,
    sort_by: getParam("sort") || "newest",
    brand_id: getParam("brand") ? Number(getParam("brand")) : undefined,
    min_price: minPriceAPI,
    max_price: maxPriceAPI,
    keyword: getParam("keyword") || undefined,
  };

  // 6. Tạo Key cho Suspense
  const suspenseKey = JSON.stringify(apiQuery);

  // 7. Data cho Sidebar UI (Filters đang active)
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
          
          {/* --- SIDEBAR (Dynamic Data) --- */}
          <div className="hidden lg:block w-64 shrink-0">
            <Sidebar data={sidebarData} initialFilters={currentFilters} />
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

            {/* SUSPENSE BOUNDARY */}
            <Suspense key={suspenseKey} fallback={<ProductSkeleton />}>
              <ProductListing apiQuery={apiQuery} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}