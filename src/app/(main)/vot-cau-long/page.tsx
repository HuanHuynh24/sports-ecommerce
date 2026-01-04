// app/products/page.tsx
import SidebarFilter from "@/components/Sidebar"; // Component Sidebar đã làm ở bài trước
import ProductGrid from "@/components/ProductGrid"; // Component vừa tạo ở trên
import SortSelect from "@/components/SortSelect";
// import Pagination from "@/components/Pagination"; 
import {  } from "@/services/product.service";  
import { pageVotCauLong } from "@/services/page.service";
import Sidebar from "@/components/Sidebar";

// Định nghĩa Props cho Server Component
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
    brand: searchParams.brand, // Lọc theo thương hiệu
    min_price: searchParams.min_price, // Lọc theo giá
    max_price: searchParams.max_price,
    // ... map các params khác
  };

  // Gọi Service chuẩn
  return await pageVotCauLong.getPages(apiParams);
}

// Dữ liệu giả lập cho Sidebar (Hoặc gọi API lấy danh mục/brand thật)
const sidebarDataStub = {
    categories: [
        { value: 1, label: "Vợt cầu lông" }, 
        { value: 2, label: "Giày cầu lông" }
    ],
    brands: [
        { value: "yonex", label: "Yonex" }, 
        { value: "lining", label: "Lining" }, 
        { value: "victor", label: "Victor" }
    ],
    priceRanges: [
        { value: "0-1000000", label: "Dưới 1 triệu" },
        { value: "1000000-3000000", label: "1 - 3 triệu" }
    ],
    discounts: [10, 20, 30]
};

export default async function ProductPage({ searchParams }: PageProps) {
  // 1. Gọi API (Await trực tiếp - Server Side)
  const response = await pageVotCauLong.getPages(searchParams);
  
  // Dữ liệu an toàn (Fallback nếu API lỗi)
  const products = response?.data?.data || [];
  const meta = response?.data?.meta || { total: 0, current_page: 1, last_page: 1 };

  // Khôi phục bộ lọc từ URL để truyền vào Sidebar (để tick sẵn ô checkbox)
  const currentFilters = {
     categories: [], // Cần logic parse từ searchParams
     brands: searchParams.brand ? (Array.isArray(searchParams.brand) ? searchParams.brand : [searchParams.brand]) : [],
     priceRanges: [],
     discounts: []
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0404]">
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 py-8">
        
        {/* Layout: Sidebar bên trái - Grid bên phải */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <div className="hidden lg:block shrink-0">
             {/* Lưu ý: Sidebar cần được refactor nhẹ để nhận filter từ URL thay vì state nội bộ nếu muốn đồng bộ hoàn hảo */}
             {/* Ở đây mình giả định SidebarFilter là Client Component */}
            <Sidebar data={sidebarDataStub} />
          </div>

          <div className="flex-1">
            {/* HEADER TOOLBAR */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/10">
               <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 sm:mb-0">
                  Hiển thị <strong>{products.length}</strong> / {meta.total} sản phẩm
               </span>
               
               <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Sắp xếp:</span>
                  <SortSelect />
               </div>
            </div>

            {/* PRODUCT GRID (Client Component) */}
            {/* Truyền mảng products xuống để render */}
            <ProductGrid products={products} />

            {/* PAGINATION */}
            {/* <div className="flex justify-center mt-8">
                <Pagination meta={meta} />
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}