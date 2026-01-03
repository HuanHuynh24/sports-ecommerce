"use client";
import React from "react";
import  { CartItem } from "@/types/types";
import {initialItems} from "@/data/constants";


function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " ₫";
}

/* =========================
 * Page
 * ========================= */

export default function GioHangPage() {
  const [items, setItems] = React.useState<CartItem[]>(initialItems);
  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    initialItems.map((i) => i.id)
  );

  const totalItems = items.length;
  const selectedCount = selectedIds.length;

  const selectedItems = React.useMemo(
    () => items.filter((i) => selectedIds.includes(i.id)),
    [items, selectedIds]
  );

  const subtotal = React.useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.price * i.qty, 0),
    [selectedItems]
  );

  const shippingFreeThreshold = 1_000_000;
  const qualifiedFreeShip = subtotal >= shippingFreeThreshold;
  const shippingText = qualifiedFreeShip ? "Free" : "Calculated at checkout";

  const allChecked = totalItems > 0 && selectedIds.length === totalItems;
  const anyChecked = selectedIds.length > 0;

  const toggleAll = () => {
    if (allChecked) setSelectedIds([]);
    else setSelectedIds(items.map((i) => i.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const changeQty = (id: string, nextQty: number) => {
    const qty = Math.max(1, nextQty);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const inc = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    changeQty(id, it.qty + 1);
  };

  const dec = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    changeQty(id, it.qty - 1);
  };

  const onCheckout = () => {
    // CHỈ gửi item đã chọn
    const payload = { cartItemIds: selectedIds };
    console.log("CHECKOUT:", payload);

    // TODO: nếu chưa đăng nhập -> redirect /dang-nhap?redirect=/gio-hang
    // TODO: gọi API tạo order draft -> chuyển /thanh-toan?orderDraftId=...
  };

  const empty = items.length === 0;

  return (
    <div className="relative flex flex-col min-h-screen">

      {/* MAIN */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-main dark:text-white">
              Giỏ hàng của bạn
            </h1>
            <p className="text-text-muted mt-1 text-sm">
              You have {items.length} items in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Cart list */}
            {!empty ? (
              items.map((it) => {
                const checked = selectedIds.includes(it.id);
                return (
                  <div
                    key={it.id}
                    className="group relative flex gap-4 bg-white dark:bg-white/5 border border-primary/20 rounded-xl p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                    style={{ opacity: checked ? 1 : 0.85 }}
                  >
                    <div className="flex items-center self-center h-full">
                      <input
                        checked={checked}
                        onChange={() => toggleOne(it.id)}
                        className="form-checkbox h-5 w-5 text-primary border-border-medium rounded focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer"
                        type="checkbox"
                      />
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row gap-6 w-full min-w-0">
                      <div className="shrink-0 relative overflow-hidden rounded-lg bg-gray-100 w-full sm:w-32 aspect-square">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url("${it.imageUrl}")` }}
                        ></div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {it.tag ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                                  {it.tag}
                                </span>
                              ) : null}
                              <span className="text-xs text-text-muted">
                                {it.category}
                              </span>
                            </div>
                            <h3 className="font-bold text-lg text-text-main dark:text-white leading-tight">
                              {it.name}
                            </h3>
                            {it.spec ? (
                              <p className="text-sm text-text-muted mt-1">
                                {it.spec}
                              </p>
                            ) : null}
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">
                              {formatVND(it.price)}
                            </p>
                            {it.originalPrice ? (
                              <p className="text-xs text-text-muted line-through">
                                {formatVND(it.originalPrice)}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-border-subtle dark:border-white/10">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-text-main dark:text-white">
                              Qty:
                            </span>

                            <div className="flex items-center h-9 rounded-lg border border-border-medium dark:border-white/20 bg-background-light dark:bg-white/5">
                              <button
                                onClick={() => dec(it.id)}
                                className="w-8 h-full flex items-center justify-center text-text-muted hover:text-primary transition-colors rounded-l-lg hover:bg-gray-100 dark:hover:bg-white/10"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  remove
                                </span>
                              </button>

                              <input
                                className="w-10 h-full text-center bg-transparent border-none focus:ring-0 text-sm font-medium text-text-main dark:text-white p-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                type="number"
                                value={it.qty}
                                onChange={(e) =>
                                  changeQty(it.id, Number(e.target.value || 1))
                                }
                              />

                              <button
                                onClick={() => inc(it.id)}
                                className="w-8 h-full flex items-center justify-center text-text-muted hover:text-primary transition-colors rounded-r-lg hover:bg-gray-100 dark:hover:bg-white/10"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  add
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              className="text-text-muted hover:text-primary flex items-center gap-1.5 text-sm font-medium transition-colors group/btn"
                            >
                              <span className="material-symbols-outlined text-lg group-hover/btn:fill-current">
                                favorite
                              </span>
                              <span className="hidden sm:inline">Save</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => removeItem(it.id)}
                              className="text-text-muted hover:text-red-600 flex items-center gap-1.5 text-sm font-medium transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty state (hiện khi empty)
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-t border-dashed border-border-medium">
                <div className="bg-gray-100 dark:bg-white/5 rounded-full p-8 mb-6">
                  <span className="material-symbols-outlined text-6xl text-text-muted/50">
                    shopping_cart_off
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                  Your cart is empty
                </h3>
                <p className="text-text-muted max-w-md mx-auto mb-8">
                  Looks like you haven&apos;t added any badminton gear to your
                  cart yet. Browse our products to find what you need.
                </p>
                <button className="h-11 px-8 rounded-lg bg-text-main dark:bg-white text-white dark:text-background-dark font-bold hover:opacity-90 transition-opacity">
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Order summary */}
            <div className="bg-white dark:bg-white/5 border border-primary/20 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-text-muted">
                  <span>Selected Items</span>
                  <span className="text-text-main dark:text-white font-medium">
                    {selectedCount} items
                  </span>
                </div>

                <div className="flex justify-between text-sm text-text-muted">
                  <span>Subtotal</span>
                  <span className="text-text-main dark:text-white font-medium">
                    {formatVND(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-text-muted">
                  <span>Shipping estimate</span>
                  <span
                    className={`font-medium ${
                      qualifiedFreeShip ? "text-green-600" : "text-text-main dark:text-white"
                    }`}
                  >
                    {shippingText}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-text-muted">
                  <span>Tax</span>
                  <span className="text-text-main dark:text-white font-medium">
                    Included
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-border-subtle dark:bg-white/10 mb-6"></div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-base font-bold text-text-main dark:text-white">
                  Order Total
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatVND(subtotal)}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onCheckout}
                  disabled={!anyChecked}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Checkout ({selectedCount})</span>
                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </button>
                <p className="text-xs text-center text-text-muted">
                  By placing your order, you agree to our Terms of Service.
                </p>
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-white dark:bg-white/5 border border-primary/20 rounded-xl p-6 shadow-sm">
              <label
                className="block text-sm font-medium text-text-main dark:text-white mb-2"
                htmlFor="promo"
              >
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-background-light dark:bg-white/5 border border-border-medium dark:border-white/20 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-text-main dark:text-white placeholder-text-muted"
                  id="promo"
                  placeholder="Enter code"
                  type="text"
                />
                <button className="px-4 py-2 bg-text-main dark:bg-white text-white dark:text-background-dark font-medium rounded-lg text-sm hover:opacity-90 transition-opacity">
                  Apply
                </button>
              </div>
            </div>

            {/* Help */}
            <div className="flex gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="shrink-0 p-2 bg-white dark:bg-background-dark rounded-full h-10 w-10 flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-main dark:text-white">
                  Need Help?
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  Call us at{" "}
                  <a className="text-primary hover:underline" href="#">
                    1900 1234
                  </a>{" "}
                  or chat with our support team.
                </p>
              </div>
            </div>

            <div className="md:hidden text-center mt-4">
              <a
                className="text-sm font-medium text-text-muted hover:text-primary underline"
                href="#"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE CHECKOUT BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a0c0c] border-t border-primary/20 p-4 shadow-xl z-40 pb-safe">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                checked={allChecked}
                onChange={toggleAll}
                className="form-checkbox h-4 w-4 text-primary border-border-medium rounded focus:ring-primary focus:ring-offset-0 bg-transparent"
                id="mobile-all"
                type="checkbox"
              />
              <label
                className="text-xs text-text-muted font-medium"
                htmlFor="mobile-all"
              >
                All
              </label>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-text-muted">
                Total ({selectedCount})
              </span>
              <span className="text-lg font-bold text-primary">
                {formatVND(subtotal)}
              </span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            disabled={!anyChecked}
            className="flex-1 max-w-[180px] h-11 flex items-center justify-center bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-sm"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
