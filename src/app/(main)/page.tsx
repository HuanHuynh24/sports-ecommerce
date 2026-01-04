"use client";

import { useState, useMemo, useEffect } from "react"; // Thêm useEffect
import CategoryGrid from "@/components/CategoryGrid";
import NewsSection from "@/components/NewsSection";
import { CATEGORIES_BADMINTON } from "@/data/constants"; // Bỏ import PRODUCTS
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import ProductCard from "@/components/ProductCard";
import { productService } from "@/services/product.service";

import type { ProductDetail } from "@/types/types";
const TABS = ["Tất cả", "Vợt cầu lông", "Pickleball", "Tennis"];

// Code phần Banner giữ nguyên...
const PROMO_BANNERS = [
  // ... (giữ nguyên như cũ để tiết kiệm chỗ hiển thị) ...
  { title: "Vợt Cao Cấp", tag: "Sale off 50%", desc: "Đến hết tháng", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYXLS-jFnYbLatr6PMGRoWa13QUgehkjGyFU_F4n7IdyV-SVJcXrcht2BTqiDTuvUBeiV-TBrJ93weK3_rjQfoDh1vwhH2TLlkLJs6w7nLpE0ffYIHsJo3GXFOES-hdfPjstuXoVYGLHFOxZW23feeJgwdUIsNxe0b03HPlXildGEZE4i6zDKX2foT9JmZY6AHy_b77k6xDDeiGJgFc9EFCu_GqJR--qotOZGjMcgNHNLYTVDqx6l0tuUaJojLIdfXNOgCUIrWsA" },
  { title: "Pickleball", tag: "Giảm giá sốc", desc: "Combo từ 999k", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBbm8ATHRKspfUH8E4Pe8WSm48X1yvJ5dkHg7IUNPTSZtXV2JjtlsPYyyhMhEgnc85S0ISS4Ki3SNOj104atoacTzxQoAJdh0kExDoA1IVDBSySw4ljcAQWqgTT6efLAgJIXt-y9i0Vb41kxyDbce2UCDR0qu4XQnWmGDBqPIoQjnpHbmGx2Zs5Ih2_OqtCFeEul4JhLt0H_DLuCVmdLKF1M_y216j8oGNSXNlq3_0wiQ9xyY5iOGS016b90QGQWZcnYCld8bgJw" },
  { title: "Giày Chính Hãng", tag: "Limited Time", desc: "Tặng tất cao cấp", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmYGlg4YS2zUJiAfUrK9XTpMVNS_oB6ZvejTrkxcDmyz_Z33b_sKWC2-vYJfjO3ij7-fWfNFh_F7z3V6l9gXfkDG29UjMQoxWEuwjx2_sEay2rIDB4sKVuWs26J75sPVutnMPdGjruY_NRneAuwpL2wntasJlMXslfQuyDe2HiE7lyeKVHJMUSz1tRGyJ9un90Dk3fwtRRmhqw9CsTya1vPyASxCBhr0dzjNTv4tNlpqYZi1mPUe784HOVjbQv4HMVhvdWK3jXIA" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  
  // 1. State lưu trữ dữ liệu từ API
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Gọi API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Thay đường dẫn này bằng API thực tế của bạn, ví dụ: 'http://localhost:8000/api/products'
        // const response = await fetch('/api/products'); 
        
        const res = await productService.getProducts();
        setProducts(res.data.data); // Cập nhật dữ liệu vào state
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setIsLoading(false); // Tắt trạng thái loading dù thành công hay thất bại
      }
    };

    fetchProducts();
  }, []);

  // 3. Logic lọc sản phẩm (dựa trên state 'products' thay vì biến hằng số)
  const filteredProducts = useMemo(() => {
    if (activeTab === "Tất cả") return products;

    return products.filter(
      (product) =>
        product.category &&
        product.category.toLowerCase().includes(activeTab.toLowerCase())
    );
  }, [activeTab, products]); // Thêm 'products' vào dependency

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <main className="flex-grow">
        <Hero />
        <Benefits />

        {/* New Arrivals Section */}
        <section className="py-16 bg-white dark:bg-[#221010]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black uppercase text-primary mb-3">
                Sản phẩm mới về
              </h2>
              <div className="w-20 h-1.5 bg-accent mx-auto rounded-full mb-8"></div>
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap justify-center gap-3">
                {TABS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    disabled={isLoading} // Chặn bấm khi đang tải
                    className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${
                      activeTab === cat
                        ? "bg-primary text-white shadow-red-200 scale-105"
                        : "bg-white dark:bg-[#333] border border-gray-200 dark:border-[#444] text-gray-700 dark:text-white hover:border-primary hover:text-primary"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid - Xử lý Loading & Error */}
            <div className="min-h-[300px]">
              {isLoading ? (
                // LOADING UI: Hiển thị Skeleton hoặc Loading Spinner
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[350px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : error ? (
                // ERROR UI
                <div className="text-center text-red-500 py-10">
                  {error}
                </div>
              ) : (
                // SUCCESS UI
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-10">
                      <p>Chưa có sản phẩm nào thuộc danh mục này.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Promo Banners */}
        <section className="py-10 bg-gray-50 dark:bg-[#1a1a1a]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROMO_BANNERS.map((promo, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden min-h-[240px] group cursor-pointer shadow-xl">
                  <img alt={promo.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={promo.img} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 uppercase tracking-wider mb-3 inline-block">{promo.tag}</span>
                    <h3 className="text-3xl font-black uppercase text-white leading-none mb-2 group-hover:translate-x-2 transition-transform">{promo.title}</h3>
                    <p className="text-gray-300 font-medium text-sm">{promo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CategoryGrid title="Danh Mục Cầu Lông" icon="shutter_speed" items={CATEGORIES_BADMINTON} themeColor="bg-primary" />
        <NewsSection />
      </main>
    </div>
  );
}