"use client";

import React, { useState, useMemo, useEffect } from "react";
//1. Import Service và Types
import { cartService } from "@/services/cart.service"; //Sửa đường dẫn nếu cần
import { ProductDetail } from "@/types/types";
//Nếu bạn dùng thư viện toast (ví dụ react-hot-toast), import ở đây:
//import toast from 'react-hot-toast';

//Helper format tiền
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(amount)
    .replace("₫", "đ");

export default function ProductDetailView({
  product,
}: {
  product: ProductDetail;
}) {
  //--- STATE ---
  const [activeImage, setActiveImage] = useState(product.thumbnail);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
    {}
  );

  //2. Thêm state loading để chặn click nhiều lần
  const [isAdding, setIsAdding] = useState(false);

  //--- LOGIC BIẾN THỂ (GIỮ NGUYÊN) ---
  const attributeNames = useMemo(() => {
    const names = new Set<string>();
    product.variants.forEach((v) => {
      if (Array.isArray(v.attributes)) {
        v.attributes.forEach((attr: any) => {
          if (attr.name) names.add(attr.name);
        });
      }
    });
    return Array.from(names);
  }, [product.variants]);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const defaultVariant =
        product.variants.find((v) => v.stock_qty > 0) || product.variants[0];
      const defaultSelection: Record<string, string> = {};
      if (Array.isArray(defaultVariant.attributes)) {
        defaultVariant.attributes.forEach((attr: any) => {
          defaultSelection[attr.name] = attr.value;
        });
      }
      setSelectedAttrs(defaultSelection);
    }
  }, [product.variants]);

  const currentVariant = useMemo(() => {
    return product.variants.find((v) => {
      return Object.entries(selectedAttrs).every(
        ([selectedName, selectedValue]) => {
          const foundAttr = Array.isArray(v.attributes)
            ? v.attributes.find((a: any) => a.name === selectedName)
            : null;
          return foundAttr && foundAttr.value === selectedValue;
        }
      );
    });
  }, [product.variants, selectedAttrs]);

  const displayPrice = currentVariant ? currentVariant.price : product.price;
  const maxStock = currentVariant ? currentVariant.stock_qty : 0;
  const isOutOfStock = maxStock === 0;

  const handleAttrChange = (name: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [name]: value }));
  };

  //--- 3. LOGIC XỬ LÝ THÊM VÀO GIỎ HÀNG (MỚI) ---
  const handleAddToCart = async () => {
    //Validate: Phải có biến thể được chọn
    if (!currentVariant) {
      alert("Vui lòng chọn đầy đủ thuộc tính sản phẩm!"); //Thay bằng toast.error(...)
      return;
    }

    //Validate: Đăng nhập (Tùy logic dự án, thường axiosClient sẽ tự handle 401)

    setIsAdding(true); //Bắt đầu loading

    try {
      const payload = {
        product_variant_id: currentVariant.id, //ID từ JSON backend
        quantity: quantity,
      };

      await cartService.addToCart(payload);

      //Thành công
      alert("Đã thêm vào giỏ hàng thành công!"); //Thay bằng toast.success(...)

      //Mở rộng: Ở đây bạn có thể gọi một hàm để cập nhật số lượng giỏ hàng trên Header
      //ví dụ: fetchCartCount();
    } catch (error: any) {
      console.error("Lỗi thêm giỏ hàng:", error);
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
      alert(message); //Thay bằng toast.error(...)
    } finally {
      setIsAdding(false); //Kết thúc loading
    }
  };

  //--- RENDER HELPERS ---
  const renderAttributeSelector = (attrName: string) => {
    const possibleValues = new Set<string>();
    product.variants.forEach((v) => {
      if (Array.isArray(v.attributes)) {
        const attr = v.attributes.find((a: any) => a.name === attrName);
        if (attr && attr.value) possibleValues.add(attr.value);
      }
    });

    const values = Array.from(possibleValues);

    return (
      <div key={attrName} className="mb-4">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          {attrName}:{" "}
          <span className="text-black dark:text-white font-bold">
            {selectedAttrs[attrName]}
          </span>
        </span>
        <div className="flex flex-wrap gap-2">
          {values.map((val, index) => {
            const isSelected = selectedAttrs[attrName] === val;
            return (
              <button
                key={index}
                onClick={() => handleAttrChange(attrName, val)}
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
      {/* LEFT: GALLERY (Giữ nguyên) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="aspect-square relative bg-white dark:bg-[#120707] rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden flex items-center justify-center p-6 shadow-sm">
          <img
            src={activeImage || "https://placehold.co/600x600"}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {[product.thumbnail, ...product.images.map((img) => img.url)].map(
            (img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-20 h-20 shrink-0 rounded-xl border-2 overflow-hidden bg-white dark:bg-[#120707] p-1 ${
                  activeImage === img
                    ? "border-[var(--color-primary)]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumb ${idx}`}
                  className="w-full h-full object-contain"
                />
              </button>
            )
          )}
        </div>
      </div>

      {/* RIGHT: INFO */}
      <div className="lg:col-span-5 flex flex-col h-full">
        {/* Breadcrumb & Title */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase text-[var(--color-primary)] tracking-wider">
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
        <div className="text-sm text-gray-500 mb-6">Mã SP: {product.sku}</div>

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

        {/* Selectors */}
        <div className="mb-6">
          {attributeNames.map((name) => renderAttributeSelector(name))}
        </div>

        {/* Actions */}
        <div className="mt-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-semibold">Số lượng:</span>
            <div className="flex items-center border border-gray-300 dark:border-white/20 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-bold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center"
              >
                +
              </button>
            </div>
            {currentVariant && (
              <span className="text-xs text-gray-500">
                (Còn {currentVariant.stock_qty} sản phẩm)
              </span>
            )}
          </div>

          <div className="flex gap-3">
            {/* 4. GẮN HÀM XỬ LÝ VÀO NÚT BUTTON */}
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
                //Spinner đơn giản khi đang loading
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
                  <span>Đang thêm...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">
                    shopping_bag
                  </span>
                  {isOutOfStock ? "Tạm hết hàng" : "Thêm vào giỏ"}
                </>
              )}
            </button>

            <button className="h-12 w-12 rounded-xl border border-gray-200 dark:border-white/10 grid place-items-center hover:bg-gray-50 dark:hover:bg-white/5 transition text-[var(--color-primary)]">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-gray-50 dark:bg-white/5 p-4 rounded-xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <h3 className="font-bold text-black dark:text-white mb-2">
            Mô tả nhanh
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />
        </div>
      </div>
    </div>
  );
}
