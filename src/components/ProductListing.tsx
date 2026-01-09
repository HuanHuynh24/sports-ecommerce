import React from "react";
import ProductGrid from "@/components/ProductGrid";
import { pageVotCauLong } from "@/services/page.service";

interface Props {
  apiQuery: any;
}

export default async function ProductListing({ apiQuery }: Props) {
  //Gọi API (Server-side)
  let products = [];
  try {
    const response = await pageVotCauLong.getPages(apiQuery);
    if (response?.data) {
      products = response.data.data || [];
    }
  } catch (error) {
    console.error("Lỗi fetch:", error);
  }

  //Trường hợp không có sản phẩm
  if (products.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
          search_off
        </span>
        <p className="text-gray-500 text-lg font-medium">
          Không tìm thấy sản phẩm nào phù hợp.
        </p>
        <a href="/products" className="text-primary hover:underline mt-2">
          Xóa bộ lọc
        </a>
      </div>
    );
  }

  //Render Grid nếu có dữ liệu
  return <ProductGrid products={products} />;
}