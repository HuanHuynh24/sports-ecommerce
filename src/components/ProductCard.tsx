"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Product } from "@/types/types";
import { useCartStore } from "@/hooks/useCart"; 

interface ProductCardProps {
  product: Product;
  onView?: (p: Product) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(amount)
    .replace("₫", "đ");

const clamp = (n: number) => Math.max(0, Math.min(99, Math.round(n)));

const ProductCard: React.FC<ProductCardProps> = ({ product, onView }) => {
  // --- TỐI ƯU HÓA STORE ---
  // 1. Lấy hàm addToCart
  const addToCart = useCartStore((state) => state.addToCart);
  
  // 2. Chỉ lấy trạng thái loading của CHÍNH SẢN PHẨM NÀY
  // !! ép kiểu về boolean (nếu undefined sẽ là false)
  const isAdding = useCartStore((state) => !!state.loadingItems[product.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    // Nếu đang thêm chính sản phẩm này thì chặn lại
    if (isAdding) return; 

    await addToCart(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onView?.(product);
  };

  // --- LOGIC GIAO DIỆN (Giữ nguyên) ---
  const discount = useMemo(() => {
    if (typeof product.discount === "number") return clamp(product.discount);
    if (product.original_price > 0 && product.price < product.original_price) {
      return clamp(((product.original_price - product.price) / product.original_price) * 100);
    }
    return undefined;
  }, [product.discount, product.original_price, product.price]);

  const hasSale = product.original_price > 0 && product.price < product.original_price;
  const productLink = `/san-pham/${product.id}`;

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-2xl",
        "bg-white dark:bg-[#120707]",
        "border border-black/5 dark:border-white/10",
        "shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_18px_45px_-26px_rgba(0,0,0,.55)]",
      ].join(" ")}
    >
      {/* Hình ảnh */}
      <div className="relative aspect-square bg-gray-50 dark:bg-[#1a0b0b]">
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/20 via-transparent to-white/10 z-10" />

        <Link href={productLink} className="block h-full w-full">
          <img
            src={product.thumbnail || "https://placehold.co/400"}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2 z-20 pointer-events-none">
          {typeof discount === "number" && discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-600 text-white text-[11px] font-extrabold px-3 py-1 shadow-sm">
              -{discount}%
            </span>
          )}
          {product.tag && (
            <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-black/50 backdrop-blur text-black dark:text-white text-[11px] font-bold px-3 py-1 border border-black/5 dark:border-white/15">
              {product.tag}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute left-3 right-3 bottom-3 z-30">
          <div className="flex items-center justify-end gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {/* Nút Xem Nhanh */}
            <button
              type="button"
              onClick={handleQuickView}
              className="h-10 w-10 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur border border-black/5 dark:border-white/15 grid place-items-center shadow-sm hover:scale-105 active:scale-95 transition text-black dark:text-white"
              title="Xem nhanh"
            >
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </button>

            {/* Nút Thêm vào giỏ (Icon nhỏ) */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`h-10 w-10 rounded-xl bg-red-600 text-white grid place-items-center shadow-sm hover:bg-red-700 active:scale-95 transition ${
                isAdding ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              title="Thêm vào giỏ"
            >
              <span className={`material-symbols-outlined text-[20px] ${isAdding ? "animate-spin" : ""}`}>
                {isAdding ? "refresh" : "add_shopping_cart"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {product.brand || "Thể Thao"}
          </div>
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.15)]" />
        </div>

        <h3 className="text-[15px] font-bold leading-snug line-clamp-2 min-h-[2.5rem] mb-3">
          <Link
            href={productLink}
            className="text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        <div className="flex items-end justify-between gap-2 border-t border-gray-100 dark:border-gray-800 pt-3 mt-auto">
          <div className="flex flex-col">
            <span className="text-red-600 dark:text-red-500 font-black text-lg leading-none">
              {formatCurrency(product.price)}
            </span>
            {hasSale && (
              <span className="text-[12px] text-gray-400 line-through font-medium mt-1">
                {formatCurrency(product.original_price)}
              </span>
            )}
          </div>

          {/* Nút Mua (Lớn) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-bold bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-gray-200 dark:shadow-none active:scale-95 ${
              isAdding ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${isAdding ? "animate-spin" : ""}`}>
              {isAdding ? "refresh" : "shopping_bag"}
            </span>
            {isAdding ? "Đang xử lý..." : "Mua"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;