"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ProductDetail, Variant } from "@/types/types";

// Helper format tiền
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(amount)
    .replace("₫", "đ");

export default function ProductDetailView({ product }: { product: ProductDetail }) {
  // --- STATE ---

  console.log("ProductDetailView Render:",  product);
  const [activeImage, setActiveImage] = useState(product.thumbnail);
  const [quantity, setQuantity] = useState(1);
  
  // State lưu các thuộc tính đang chọn. Ví dụ: { "Trọng lượng": "4U", "Cán": "G5" }
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});

  // --- LOGIC BIẾN THỂ (VARIANTS) ---
  
  // 1. Lấy danh sách tất cả các Key thuộc tính có thể có (ví dụ: ["Cán", "Trọng lượng"])
  const attributeKeys = useMemo(() => {
    const keys = new Set<string>();
    product.variants.forEach((v) => {
      Object.keys(v.attributes).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  }, [product.variants]);

  // 2. Khởi tạo giá trị mặc định khi vào trang (chọn variant đầu tiên có hàng)
  useEffect(() => {
    if (product.variants.length > 0) {
      const defaultVariant = product.variants.find((v) => v.stock_qty > 0) || product.variants[0];
      setSelectedAttrs(defaultVariant.attributes);
    }
  }, [product.variants]);

  // 3. Tìm Variant khớp với các thuộc tính đang chọn
  const currentVariant = useMemo(() => {
    return product.variants.find((v) => {
      return Object.entries(selectedAttrs).every(
        ([key, value]) => v.attributes[key] === value
      );
    });
  }, [product.variants, selectedAttrs]);

  // 4. Giá hiển thị (Ưu tiên giá Variant nếu có, không thì giá Product)
  const displayPrice = currentVariant ? currentVariant.price : product.price;
  const maxStock = currentVariant ? currentVariant.stock_qty : 0;
  const isOutOfStock = maxStock === 0;

  // Xử lý thay đổi thuộc tính
  const handleAttrChange = (key: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [key]: value }));
  };

  // --- RENDER HELPERS ---
  const renderAttributeSelector = (key: string) => {
    // Lấy các giá trị unique cho key này (ví dụ Key="Trọng lượng" -> ["3U", "4U"])
    const values = Array.from(new Set(product.variants.map((v) => v.attributes[key]))).filter(Boolean);

    return (
      <div key={key} className="mb-4">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          {key}: <span className="text-black dark:text-white font-bold">{selectedAttrs[key]}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {values.map((val) => {
            const isSelected = selectedAttrs[key] === val;
            return (
              <button
                key={val}
                onClick={() => handleAttrChange(key, val)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium border transition-all
                  ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md"
                      : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:border-[var(--color-primary)]"
                  }
                `}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* LEFT: GALLERY */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Image */}
        <div className="aspect-square relative bg-white dark:bg-[#120707] rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden flex items-center justify-center p-6 shadow-sm">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          />
          {product.original_price > displayPrice && (
             <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
               -{Math.round(((product.original_price - displayPrice) / product.original_price) * 100)}%
             </span>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {[product.thumbnail, ...product.images.map((img) => img.url)].map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`
                relative w-20 h-20 shrink-0 rounded-xl border-2 overflow-hidden bg-white dark:bg-[#120707] p-1
                ${activeImage === img ? "border-[var(--color-primary)]" : "border-transparent hover:border-gray-300 dark:hover:border-white/20"}
              `}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: INFO */}
      <div className="lg:col-span-5 flex flex-col h-full">
        {/* Breadcrumb / Brand */}
        <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase text-[var(--color-primary)] tracking-wider">
                {product.brand.name}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500">{product.category.name}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2">
          {product.name}
        </h1>
        <div className="text-sm text-gray-500 mb-6">Mã SP: {currentVariant?.sku || product.sku}</div>

        {/* Price */}
        <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100 dark:border-white/10">
          <span className="text-3xl font-black text-[var(--color-primary)]">
            {formatCurrency(displayPrice)}
          </span>
          {product.original_price > displayPrice && (
            <span className="text-lg text-gray-400 line-through font-medium mb-1">
              {formatCurrency(product.original_price)}
            </span>
          )}
        </div>

        {/* Variant Selectors */}
        <div className="mb-6">
            {attributeKeys.map((key) => renderAttributeSelector(key))}
        </div>

        {/* Actions */}
        <div className="mt-auto">
          {/* Quantity */}
          <div className="flex items-center gap-4 mb-4">
             <span className="text-sm font-semibold">Số lượng:</span>
             <div className="flex items-center border border-gray-300 dark:border-white/20 rounded-lg">
                <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white"
                >-</button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white"
                >+</button>
             </div>
            
          </div>

          <div className="flex gap-3">
             <button
                disabled={isOutOfStock}
                onClick={() => console.log("Add to Cart", { ...product, variant: currentVariant, quantity })}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black font-bold h-12 rounded-xl hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
                <span className="material-symbols-outlined">shopping_bag</span>
                {isOutOfStock ? "Tạm hết hàng" : "Thêm vào giỏ"}
             </button>
             
             <button className="h-12 w-12 rounded-xl border border-gray-200 dark:border-white/10 grid place-items-center hover:bg-gray-50 dark:hover:bg-white/5 transition text-[var(--color-primary)]">
                <span className="material-symbols-outlined">favorite</span>
             </button>
          </div>
        </div>
        
        {/* Description Short */}
        <div className="mt-8 bg-gray-50 dark:bg-white/5 p-4 rounded-xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
           <h3 className="font-bold text-black dark:text-white mb-2">Mô tả nhanh</h3>
           <div dangerouslySetInnerHTML={{__html: product.description}} />
        </div>
      </div>
    </div>
  );
}