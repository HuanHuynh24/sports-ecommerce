"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    
    //Reset về trang 1 khi đổi sort
    if (params.get("page")) params.set("page", "1");

    //startTransition giúp UI không bị đơ, cho phép React hiển thị loading cũ
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      <select
        onChange={handleSortChange}
        disabled={isPending}
        defaultValue={searchParams.get("sort") || "newest"}
        className={`border border-gray-300 text-sm rounded-lg p-2.5 outline-none focus:border-primary bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-opacity ${
          isPending ? "opacity-60 cursor-wait" : "cursor-pointer"
        }`}
      >
        <option value="newest">Mới nhất</option>
        <option value="price_asc">Giá: Thấp đến Cao</option>
        <option value="price_desc">Giá: Cao đến Thấp</option>
        <option value="name_asc">Tên: A - Z</option>
      </select>
      
      {/* Icon loading nhỏ xoay xoay bên phải (Optional) */}
      {isPending && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <span className="block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
        </div>
      )}
    </div>
  );
}