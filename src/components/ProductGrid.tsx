"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/types";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  //const { addToCart } = useCart();

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed">
        <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}