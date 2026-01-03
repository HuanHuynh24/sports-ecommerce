import React from "react";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { productService } from "@/services/product.service";

interface PageProps {
  params: { id: string };
}

// 1. Generate Metadata cho SEO (Optional nhưng nên có)
// export async function generateMetadata({ params }: PageProps) {
//   const product = await productService.getDetail(params.id);
//   if (!product) return { title: "Sản phẩm không tồn tại" };
  
//   return {
//     title: `${product.name} | WebTop Cầu Lông`,
//     description: product.description.substring(0, 160),
//     openGraph: {
//       images: [product.thumbnail],
//     },
//   };
// }

// 2. Main Page Component
export default async function ProductDetailPage({ params }: PageProps) {
  // Fetch dữ liệu trên Server
  const product = await productService.getDetail(params.id);

  console.log("Product Detail:", product);
  // Nếu không có sản phẩm -> trang 404
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen py-8 md:py-12 bg-white dark:bg-[#0a0404]">
      <div className="max-w-[1200px] mx-auto px-4">
         {/* Gọi Client Component để xử lý tương tác */}
         <ProductDetailView product={product} />
      </div>
    </main>
  );
}