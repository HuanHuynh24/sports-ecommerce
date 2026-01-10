// components/header/HeaderCart.tsx
"use client";

import Link from "next/link";
import { useCartStore } from "@/hooks/useCart";
import { useEffect } from "react";

// 1. Định nghĩa Props để nhận tín hiệu từ HeaderClient
interface HeaderCartProps {
  enableFetch?: boolean;
}

export default function HeaderCart({ enableFetch = false }: HeaderCartProps) {
  const cartCount = useCartStore((state) => state.cartCount);
  const fetchCartCount = useCartStore((state) => state.fetchCart);

  // 2. Logic quan trọng: Chỉ gọi API khi enableFetch = true (tức là Auth đã verify xong)
  useEffect(() => {
    if (enableFetch) {
      fetchCartCount();
    }
  }, [fetchCartCount, enableFetch]);

  return (
    <Link
      href="/gio-hang"
      className="flex flex-col items-center gap-1 group relative"
    >
      <div className="relative p-2.5 rounded-full bg-gray-50 dark:bg-[#2a1515] group-hover:bg-primary group-hover:text-white transition-all duration-300 text-[#333] dark:text-white shadow-sm">
        <span className="material-symbols-outlined">shopping_cart</span>
        <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1e0e0e] shadow-sm">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      </div>
    </Link>
  );
}