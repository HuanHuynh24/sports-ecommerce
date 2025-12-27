"use client";
import React, { useMemo } from "react";
import type { Product } from "@/types/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (p: Product) => void;
  onView?: (p: Product) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(amount)
    .replace("₫", "đ");

const clamp = (n: number) => Math.max(0, Math.min(99, Math.round(n)));

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onView }) => {
  const discount = useMemo(() => {
    if (typeof product.discount === "number") return clamp(product.discount);
    if (product.originalPrice > 0 && product.currentPrice < product.originalPrice) {
      return clamp(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
    }
    return undefined;
  }, [product.discount, product.originalPrice, product.currentPrice]);

  const hasSale = product.originalPrice > 0 && product.currentPrice < product.originalPrice;

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
      {/* MEDIA */}
      <div className="relative aspect-square bg-[var(--color-surface-2)] dark:bg-[#1a0b0b]">
        {/* subtle highlight */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/18 via-black/0 to-white/10" />

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-[1.05]"
        />

        {/* BADGES */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {typeof discount === "number" && discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-[var(--color-primary)] text-white text-[11px] font-extrabold px-3 py-1 shadow-sm">
              -{discount}%
            </span>
          )}
          {product.tag && (
            <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-white/10 backdrop-blur text-black dark:text-white text-[11px] font-bold px-3 py-1 border border-black/5 dark:border-white/15">
              {product.tag}
            </span>
          )}
        </div>

        {/* QUICK ACTION BAR (cân đối hơn) */}
        <div className="absolute left-3 right-3 bottom-3">
          <div className="flex items-center justify-end gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              type="button"
              onClick={() => onView?.(product)}
              className="h-10 w-10 rounded-xl bg-white/90 dark:bg-white/10 backdrop-blur border border-black/5 dark:border-white/15 grid place-items-center shadow-sm hover:scale-[1.03] active:scale-95 transition"
              aria-label="Xem nhanh"
              title="Xem nhanh"
            >
              <span className="material-symbols-outlined text-[20px] text-black dark:text-white">
                visibility
              </span>
            </button>

            <button
              type="button"
              onClick={() => onAddToCart?.(product)}
              className="h-10 w-10 rounded-xl bg-[var(--color-primary)] text-white grid place-items-center shadow-sm hover:brightness-110 active:scale-95 transition"
              aria-label="Thêm vào giỏ"
              title="Thêm vào giỏ"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* brand + dot */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] font-extrabold uppercase tracking-wide text-black/55 dark:text-white/60">
            {product.brand}
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_0_6px_var(--color-ring)]" />
        </div>

        {/* name */}
        <h3 className="mt-2 text-[15px] font-bold leading-6 text-black dark:text-white line-clamp-2">
          {product.name}
        </h3>

        {/* location */}
        <div className="mt-2 text-[12px] font-semibold text-black/55 dark:text-white/55">
          {product.location}
        </div>

        {/* price + CTA */}
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-black/5 dark:border-white/10 pt-4">
          <div className="min-w-0">
            <div className="text-[var(--color-primary)] font-black text-[20px] leading-none">
              {formatCurrency(product.currentPrice)}
            </div>
            {hasSale && (
              <div className="mt-1 text-[12px] text-black/45 dark:text-white/45 line-through font-semibold">
                {formatCurrency(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className={[
              "shrink-0 inline-flex items-center gap-2",
              "rounded-full px-4 py-2 text-[13px] font-bold",
              "bg-black text-white hover:bg-[var(--color-primary)] transition",
              "shadow-[0_12px_24px_-18px_rgba(0,0,0,.6)]",
              "active:scale-95",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            Mua
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
