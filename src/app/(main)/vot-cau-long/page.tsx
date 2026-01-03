// app/products/page.tsx
import React, { Suspense } from "react";
import SidebarFilter from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
// import Pagination from "@/components/Pagination"; // Tách Pagination ra component riêng
import { pageVotCauLong } from "@/services/page.service";
import { da } from "zod/locales";

// Định nghĩa Props cho Server Component (nhận searchParams từ URL)
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Hàm lấy dữ liệu trên Server
async function getProducts(searchParams: any) {
  // Xử lý logic sort từ searchParams
  let sortParams = { sort_by: "created_at", order: "desc" };
  if (searchParams.sort === "price_asc") sortParams = { sort_by: "price", order: "asc" };
  if (searchParams.sort === "price_desc") sortParams = { sort_by: "price", order: "desc" };

  const apiParams = {
    ...sortParams,
    page: searchParams.page || 1,
    brand: searchParams.brand,
    // ... map các params khác
  };

  return await pageVotCauLong.getPages(apiParams);
}

export default async function ProductPage({ searchParams }: PageProps) {
  // 1. Gọi API (Await trực tiếp - Server Side)
  // Next.js sẽ tự động dedup request nếu gọi nhiều lần
  const { data: responseData } = await getProducts(searchParams);
    console.log("API Response:", responseData);
  
  const products = responseData?.data || [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR (Client Component) */}
          {/* <Suspense fallback={<div>Loading Sidebar...</div>}>
             <SidebarFilter />
          </Suspense> */}

          <div className="flex-1">
            {/* HEADER TOOLBAR */}
            <div className="mb-6 flex justify-between items-center bg-white p-3 rounded border">
               {/* <span>Hiển thị <strong>{products.length}</strong> / {meta.total} sản phẩm</span> */}
               
               {/* Sort Select: Cần là Client Component nhỏ hoặc dùng Link đơn giản */}
               {/* Ở đây mình giả định bạn tạo 1 Client Component cho Sort */}
               {/* <SortDropdown /> */}
            </div>

            {/* PRODUCT GRID (Server Rendered HTML) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {products.length > 0 ? (
                products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                    <p>Không tìm thấy sản phẩm nào.</p>
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {/* <Pagination meta={meta} /> */}
          </div>
        </div>
      </main>
    </div>
  );
}