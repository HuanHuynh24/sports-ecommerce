"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cartService } from "@/services/cart.service"; // Đảm bảo đường dẫn đúng
// import { toast } from 'react-hot-toast'; // Bật nếu dùng toast

// --- 1. ĐỊNH NGHĨA TYPES (Dựa trên JSON thực tế) ---

export interface Attribute {
  name: string;
  value: string;
}

export interface Variant {
  id: number;
  sku: string;
  price: number;
  stock_qty: number;
  is_in_stock: boolean;
  image: string | null; // Có thể null
  attributes: Attribute[]; // Có thể rỗng []
}

export interface RelatedProduct {
  id: number;
  name: string;
  thumbnail: string;
  price: number;
  original_price: number;
  discount_rate: number;
  category_name?: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  sku: string;
  description: string;
  thumbnail: string;
  price: number;
  original_price: number;
  category: { id: number; name: string };
  brand: { id: number; name: string };
  images: { id: number; url: string }[];
  variants: Variant[];
  related_products?: RelatedProduct[];
}

// --- HELPER ---
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(amount)
    .replace("₫", "đ");

export default function ProductDetailView({
  product,
}: {
  product: ProductDetail;
}) {
  // --- STATE ---
  const [activeImage, setActiveImage] = useState(product.thumbnail);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // State cho biến thể CÓ thuộc tính (Size, Color...)
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
    {}
  );

  // State cho biến thể KHÔNG thuộc tính (Chọn trực tiếp ID)
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );

  // --- COMPUTED LOGIC ---

  // 1. Kiểm tra xem sản phẩm có dùng hệ thuộc tính không
  const hasAttributes = useMemo(() => {
    return product.variants.some(
      (v) => v.attributes && v.attributes.length > 0
    );
  }, [product.variants]);

  // 2. Lấy danh sách tên thuộc tính (nếu có)
  const attributeNames = useMemo(() => {
    if (!hasAttributes) return [];
    const names = new Set<string>();
    product.variants.forEach((v) => {
      v.attributes.forEach((attr) => names.add(attr.name));
    });
    return Array.from(names);
  }, [product.variants, hasAttributes]);

  // 3. Xác định Variant hiện tại đang chọn
  const currentVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;

    if (hasAttributes) {
      // Logic cũ: Tìm theo attributes khớp nhau
      return product.variants.find((v) =>
        Object.entries(selectedAttrs).every(([key, value]) =>
          v.attributes.find((a) => a.name === key && a.value === value)
        )
      );
    } else {
      // Logic mới: Tìm theo ID đã chọn thủ công
      return product.variants.find((v) => v.id === selectedVariantId) || null;
    }
  }, [product.variants, selectedAttrs, selectedVariantId, hasAttributes]);

  // 4. Lấy thông tin hiển thị (Giá, Kho)
  const displayPrice = currentVariant ? currentVariant.price : product.price;
  const maxStock = currentVariant ? currentVariant.stock_qty : 0;
  const isOutOfStock = currentVariant ? maxStock === 0 : false;

  // --- EFFECTS ---

  // Effect 1: Chọn mặc định biến thể đầu tiên còn hàng khi load trang
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const defaultVariant =
        product.variants.find((v) => v.stock_qty > 0) || product.variants[0];

      if (defaultVariant) {
        if (hasAttributes) {
          const defaultSelection: Record<string, string> = {};
          defaultVariant.attributes.forEach((attr) => {
            defaultSelection[attr.name] = attr.value;
          });
          setSelectedAttrs(defaultSelection);
        } else {
          setSelectedVariantId(defaultVariant.id);
        }
      }
    }
  }, [product.variants, hasAttributes]);

  // Effect 2: Tự động đổi ảnh khi chọn biến thể (Nếu biến thể có ảnh)
  useEffect(() => {
    if (currentVariant && currentVariant.image) {
      setActiveImage(currentVariant.image);
    }
    // Nếu muốn revert về ảnh gốc khi variant ko có ảnh thì bỏ comment dòng dưới:
    // else { setActiveImage(product.thumbnail); }
  }, [currentVariant]);

  // --- HANDLERS ---

  const handleAttrChange = (name: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = async () => {
    if (!currentVariant) {
      alert("Vui lòng chọn phiên bản sản phẩm!");
      return;
    }
    // Logic check login ở đây nếu cần

    setIsAdding(true);
    try {
      const payload = {
        product_variant_id: currentVariant.id,
        quantity: quantity,
      };
      await cartService.addToCart(payload);

      alert("Đã thêm vào giỏ hàng thành công!");
      // toast.success("Thêm thành công!");
    } catch (error: any) {
      console.error("Lỗi thêm giỏ hàng:", error);
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
      alert(message);
    } finally {
      setIsAdding(false);
    }
  };

  // --- RENDER HELPERS ---

  // A. Render khi có thuộc tính (Size, Màu)
  const renderAttributeSelector = (attrName: string) => {
    const possibleValues = Array.from(
      new Set(
        product.variants.flatMap((v) =>
          v.attributes.filter((a) => a.name === attrName).map((a) => a.value)
        )
      )
    );

    return (
      <div key={attrName} className="mb-4">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          {attrName}:{" "}
          <span className="text-black dark:text-white font-bold">
            {selectedAttrs[attrName]}
          </span>
        </span>
        <div className="flex flex-wrap gap-2">
          {possibleValues.map((val) => {
            const isSelected = selectedAttrs[attrName] === val;
            return (
              <button
                key={val}
                onClick={() => handleAttrChange(attrName, val)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  isSelected
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-gray-200 bg-white text-gray-700 hover:border-black dark:bg-white/5 dark:border-white/10 dark:text-gray-300"
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // B. Render khi KHÔNG có thuộc tính (JSON attributes: []) -> Chọn theo ID/SKU
  const renderVariantSelector = () => {
    // Nếu chỉ có 1 biến thể duy nhất thì không cần hiển thị nút chọn
    if (product.variants.length <= 1) return null;

    return (
      <div className="mb-6">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          Chọn phiên bản:
        </span>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const isSelected = selectedVariantId === v.id;
            const isOutOfStockVariant = v.stock_qty === 0;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium border transition-all flex flex-col items-center min-w-[80px]
                  ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md" // Style Active
                      : "border-gray-200 bg-white text-gray-700 hover:border-[var(--color-primary)] dark:bg-white/5 dark:border-white/10 dark:text-gray-300" // Style Inactive
                  }
                  ${
                    isOutOfStockVariant
                      ? "opacity-60 cursor-not-allowed grayscale"
                      : ""
                  }
                `}
              >
                <span className="font-bold">{v.sku}</span>
                <span className="text-[10px] opacity-80 mt-1">
                  {isOutOfStockVariant ? "Hết hàng" : `Còn ${v.stock_qty}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* --- LEFT: GALLERY --- */}
        {/* --- LEFT: GALLERY (Đã sửa lỗi hiển thị ảnh null) --- */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. ẢNH CHÍNH (MAIN IMAGE) */}
          <div className="aspect-square relative bg-white dark:bg-[#120707] rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden flex items-center justify-center p-6 shadow-sm">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
              />
            ) : (
              // Fallback: Hiển thị box xám khi activeImage là null
              <div className="w-full h-full bg-gray-200 dark:bg-white/10 flex flex-col items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">
                  image_not_supported
                </span>
                <span className="text-sm font-medium">Không có ảnh</span>
              </div>
            )}
          </div>

          {/* 2. DANH SÁCH THUMBNAIL (Sửa lỗi mapping) */}
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {/* Tạo mảng gồm Thumbnail gốc + Các ảnh phụ từ mảng images */}
            {[
              { id: "thumb-main", url: product.thumbnail },
              ...(product.images || []).map((img) => ({
                id: img.id,
                url: img.url,
              })),
            ].map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setActiveImage(item.url)}
                className={`
            relative w-20 h-20 shrink-0 rounded-xl border-2 overflow-hidden 
            ${
              activeImage === item.url
                ? "border-black dark:border-white ring-1 ring-black/10"
                : "border-transparent hover:border-gray-300"
            }
          `}
              >
                {item.url ? (
                  <img
                    src={item.url}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-contain bg-white dark:bg-[#120707]"
                  />
                ) : (
                  // Fallback: Thumbnail xám nếu url trong json là null
                  <div className="w-full h-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400 text-lg">
                      image
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- RIGHT: INFO --- */}
        <div className="lg:col-span-5 flex flex-col h-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">
              {product.brand?.name}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500">
              {product.category?.name}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2">
            {product.name}
          </h1>
          <div className="text-sm text-gray-500 mb-6">
            Mã SP:{" "}
            <span className="font-mono text-gray-700 dark:text-gray-300">
              {product.sku}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100 dark:border-white/10">
            <span className="text-3xl font-black text-red-600">
              {formatCurrency(displayPrice)}
            </span>
            {product.original_price > displayPrice && (
              <span className="text-lg text-gray-400 line-through font-medium mb-1">
                {formatCurrency(product.original_price)}
              </span>
            )}
          </div>

          {/* Selectors (Logic kép) */}
          <div className="mb-6">
            {hasAttributes
              ? attributeNames.map((name) => renderAttributeSelector(name))
              : renderVariantSelector()}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Số lượng:
              </span>
              <div className="flex items-center border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-l-lg transition"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-r-lg transition"
                >
                  +
                </button>
              </div>
              {currentVariant && (
                <span
                  className={`text-xs font-medium ${
                    isOutOfStock ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {isOutOfStock
                    ? "(Tạm hết hàng)"
                    : `(Sẵn có ${maxStock} sản phẩm)`}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                disabled={isOutOfStock || isAdding}
                onClick={handleAddToCart}
                className={`
                  flex-1 bg-black dark:bg-white text-white dark:text-black font-bold h-12 rounded-xl 
                  hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isAdding ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">
                      shopping_bag
                    </span>
                    {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                  </>
                )}
              </button>

              <button className="h-12 w-12 rounded-xl border border-gray-200 dark:border-white/10 grid place-items-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition text-gray-400">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 bg-gray-50 dark:bg-white/5 p-5 rounded-xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <h3 className="font-bold text-black dark:text-white mb-2 uppercase text-xs">
              Mô tả sản phẩm
            </h3>
            <div
              dangerouslySetInnerHTML={{
                __html: product.description || "<p>Đang cập nhật...</p>",
              }}
            />
          </div>
        </div>
      </div>

      {/* --- SECTION: RELATED PRODUCTS --- */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-200 dark:border-white/10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {product.related_products.map((item) => (
              <Link
                href={`/product/${item.id}`}
                key={item.id}
                className="group block"
              >
                <div className="aspect-square bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden mb-3 border border-transparent group-hover:border-black/10 dark:group-hover:border-white/20 transition relative">
                  {item.discount_rate > 0 && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      -{item.discount_rate}%
                    </span>
                  )}
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-red-600">
                    {formatCurrency(item.price)}
                  </span>
                  {item.original_price > item.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(item.original_price)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
