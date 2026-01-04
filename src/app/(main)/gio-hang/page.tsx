"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { cartService } from "@/services/cart.service";
import { toast } from "react-hot-toast";

/* =========================================================================
 * 1. TYPES & INTERFACES
 * ========================================================================= */
interface ProductAttribute {
  [key: string]: string;
}

export interface CartItemAPI {
  id: number;
  quantity: number;
  product_variant_id: number;
  sku: string;
  name: string;
  attributes: ProductAttribute;
  image_url: string;
  price: number;
  subtotal: number;
  in_stock: boolean;
  max_qty: number;
  is_selected: boolean;
}

interface CartResponse {
  id: number;
  total_items: number;
  total_price: number;
  items: CartItemAPI[];
}

/* =========================================================================
 * 2. HELPER FUNCTIONS
 * ========================================================================= */
const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const formatAttributes = (attrs: ProductAttribute) => {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" | ");
};

/* =========================================================================
 * 3. COMPONENT CON: QUANTITY CONTROL (DEBOUNCE)
 * ========================================================================= */
interface QuantityControlProps {
  itemId: number;
  initialQty: number;
  maxQty: number;
  onUpdateDebounced: (id: number, qty: number) => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  itemId,
  initialQty,
  maxQty,
  onUpdateDebounced,
}) => {
  const [qty, setQty] = useState(initialQty);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQty(initialQty);
  }, [initialQty]);

  const handleChange = (newQty: number) => {
    if (newQty < 1 || newQty > maxQty) return;
    setQty(newQty);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onUpdateDebounced(itemId, newQty);
    }, 500);
  };

  return (
    <div className="flex items-center h-9 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5">
      <button
        onClick={() => handleChange(qty - 1)}
        disabled={qty <= 1}
        className="w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 rounded-l-lg disabled:opacity-30 transition-colors"
        type="button"
      >
        -
      </button>
      <input
        className="w-10 h-full text-center bg-transparent border-none text-sm font-medium p-0 focus:ring-0"
        type="number"
        value={qty}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <button
        onClick={() => handleChange(qty + 1)}
        disabled={qty >= maxQty}
        className="w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 rounded-r-lg disabled:opacity-30 transition-colors"
        type="button"
      >
        +
      </button>
    </div>
  );
};

/* =========================================================================
 * 4. MAIN PAGE: GIỎ HÀNG
 * ========================================================================= */
export default function GioHangPage() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA ---
  const fetchCart = async () => {
    try {
      const res = await cartService.getCart();
      if (res.status && res.data) {
        setCartData(res.data);
      }
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
      toast.error("Không thể tải giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- CALCULATIONS ---
  const items = cartData?.items || [];
  const isEmpty = !isLoading && items.length === 0;
  
  // Lọc ra các item đã chọn
  const selectedItems = items.filter((i) => i.is_selected);
  const selectedCount = selectedItems.length;
  const displayTotalPrice = cartData?.total_price || 0;

  // --- HANDLERS ---
  const handleSelection = async (itemIds: number[], isSelected: boolean) => {
    // Optimistic UI
    setCartData((prev) => {
      if (!prev) return null;
      const newItems = prev.items.map((i) =>
        itemIds.includes(i.id) ? { ...i, is_selected: isSelected } : i
      );
      // Tính lại tổng tiền tạm thời client-side
      const tempTotal = newItems.reduce(
        (acc, item) => (item.is_selected ? acc + item.price * item.quantity : acc),
        0
      );
      return { ...prev, items: newItems, total_price: tempTotal };
    });

    try {
      const res = await cartService.updateSelection(itemIds, isSelected);
      if (res.status && res.data) {
        setCartData((prev) => (prev ? { ...prev, ...res.data } : res.data));
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
      fetchCart();
    }
  };

  const handleSelectAll = () => {
    const allIds = items.map((i) => i.id);
    const isAllSelected = items.length > 0 && items.every((i) => i.is_selected);
    handleSelection(allIds, !isAllSelected);
  };

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    try {
      await cartService.updateQuantity(itemId, newQty);
      await fetchCart(); 
    } catch (error) {
      toast.error("Không thể cập nhật số lượng");
      fetchCart();
    }
  };

  const handleRemove = async (itemId: number) => {
    if (!confirm("Bạn muốn xóa sản phẩm này?")) return;
    
    setCartData((prev) => {
        if(!prev) return null;
        return { ...prev, items: prev.items.filter(i => i.id !== itemId) }
    });

    try {
      await cartService.removeItem(itemId);
      toast.success("Đã xóa sản phẩm");
      fetchCart();
    } catch (error) {
      toast.error("Xóa thất bại");
      fetchCart();
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Xóa toàn bộ giỏ hàng?")) return;
    try {
      await cartService.clearCart();
      setCartData({ ...cartData!, items: [], total_price: 0, total_items: 0 });
      toast.success("Đã làm trống giỏ");
    } catch (error) {
      toast.error("Lỗi hệ thống");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Giỏ hàng ({items.length})</h1>
          </div>
          {!isEmpty && (
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline transition-colors"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {!isEmpty ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`relative flex gap-4 p-4 rounded-xl border bg-white dark:bg-white/5 transition-all shadow-sm
                    ${item.is_selected 
                      ? "border-primary/50 ring-1 ring-primary/20" 
                      : "border-gray-200 dark:border-gray-700 opacity-95"
                    }`}
                >
                  {/* CHECKBOX */}
                  <div className="flex items-center self-center">
                    <input
                      type="checkbox"
                      checked={item.is_selected}
                      onChange={() => handleSelection([item.id], !item.is_selected)}
                      className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 flex flex-col sm:flex-row gap-4">
                    {/* IMAGE */}
                    <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100 border dark:border-gray-700">
                      <img
                        src={item.image_url || "https://placehold.co/400"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.sku}</span>
                            <h3 className="font-bold text-lg leading-tight mb-1">
                              <Link href={`/san-pham/${item.product_variant_id}`} className="hover:text-primary transition-colors">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                              {formatAttributes(item.attributes)}
                            </p>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-lg text-primary dark:text-green-400">
                                {formatVND(item.price)}
                             </p>
                             <p className="text-xs text-gray-400">
                                Tổng: {formatVND(item.price * item.quantity)}
                             </p>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                         {/* QUANTITY CONTROL */}
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">Số lượng:</span>
                            <QuantityControl 
                                itemId={item.id}
                                initialQty={item.quantity}
                                maxQty={item.max_qty}
                                onUpdateDebounced={handleUpdateQty}
                            />
                            <span className="text-xs text-gray-400">
                                (Sẵn: {item.max_qty})
                            </span>
                         </div>

                         <button
                           onClick={() => handleRemove(item.id)}
                           className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                         >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            Xóa
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // EMPTY STATE
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                 <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart</span>
                 <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
                 <p className="text-gray-500 mb-6 text-center max-w-xs">Chưa có sản phẩm nào. Hãy tìm kiếm sản phẩm yêu thích của bạn nhé!</p>
                 <Link href="/" className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-90 transition-all">
                   Tiếp tục mua sắm
                 </Link>
              </div>
            )}
          </div>

          {/* RIGHT: ORDER SUMMARY (STICKY) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
             <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Thanh toán</h2>

                {/* --- LIST CÁC SẢN PHẨM ĐÃ CHỌN --- */}
                {selectedItems.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                      Chi tiết đơn hàng ({selectedItems.length})
                    </p>
                    
                    {/* SCROLLABLE LIST */}
                    <div className="max-h-[240px] overflow-y-auto pr-2 space-y-3 
                        [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm gap-3">
                          <div className="flex-1">
                            <p className="text-gray-800 dark:text-gray-200 font-medium line-clamp-2 leading-snug">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                               <span className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">
                                 x{item.quantity}
                               </span>
                               <span className="truncate max-w-[120px]">
                                 {formatAttributes(item.attributes)}
                               </span>
                            </div>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatVND(item.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                                <p className="text-[10px] text-gray-400">
                                    {formatVND(item.price)}/sp
                                </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-4 border-dashed"></div>
                  </div>
                )}

                {/* SUMMARY DETAILS */}
                <div className="space-y-4 mb-6">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Tạm tính</span>
                      <span className="font-medium">{formatVND(displayTotalPrice)}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Giảm giá</span>
                      <span className="font-medium text-primary">- 0 ₫</span>
                   </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>

                <div className="flex justify-between items-end mb-6">
                   <span className="font-bold text-lg">Tổng cộng</span>
                   <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{formatVND(displayTotalPrice)}</p>
                      <p className="text-xs text-gray-400">(Đã bao gồm VAT)</p>
                   </div>
                </div>

                <button
                   disabled={selectedCount === 0}
                   className="w-full py-3.5 flex items-center justify-center gap-2 bg-primary hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                   <span>Mua Ngay ({selectedCount})</span>
                   <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
             </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 p-4 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <input 
                   type="checkbox" 
                   checked={items.length > 0 && items.every(i => i.is_selected)}
                   onChange={handleSelectAll}
                   className="w-5 h-5 text-primary rounded border-gray-300"
                />
                <span className="text-sm font-medium">Tất cả</span>
             </div>

             <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="text-right">
                   <p className="text-xs text-gray-500">Tổng tiền</p>
                   <p className="font-bold text-primary">{formatVND(displayTotalPrice)}</p>
                </div>
                <button
                   disabled={selectedCount === 0}
                   className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg disabled:bg-gray-400"
                >
                   Mua ({selectedCount})
                </button>
             </div>
         </div>
      </div>
    </div>
  );
}