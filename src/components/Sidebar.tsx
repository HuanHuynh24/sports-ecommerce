"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/types";

// --- Types ---
type Option = { value: string; label: string; subLabel?: string };

type SidebarData = {
  categories?: Array<{ value: Category; label: string }>;
  discounts?: number[];
  priceRanges?: Option[];
  brands?: Option[];
};

interface SidebarProps {
  data: SidebarData;
  // Đã xóa filters và setFilters để tránh lỗi "Functions cannot be passed directly..."
}

// --- Sub-components (Giữ nguyên giao diện cũ) ---
function Section({
  icon,
  title,
  children,
  className = "",
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white dark:bg-[#120707] p-5 rounded-xl border border-black/5 dark:border-white/10 shadow-sm ${className}`}>
      <h3 className="text-[15px] font-extrabold uppercase border-b border-black/5 dark:border-white/10 pb-3 mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
        <span className="material-symbols-outlined text-[20px] text-primary">
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
  highlight = false,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  highlight?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary dark:bg-black/20 dark:border-white/20"
      />
      <span
        className={`text-sm select-none ${
          checked || highlight
            ? "font-bold text-primary"
            : "text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

// --- Main Component ---
export default function Sidebar({ data }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State local chỉ dùng để filter danh sách hiển thị (Input tìm kiếm)
  const [qCategory, setQCategory] = useState("");
  const [qBrand, setQBrand] = useState("");

  // --- Logic xử lý URL ---
  
  // 1. Hàm kiểm tra xem 1 giá trị có đang được chọn trên URL không
  const isChecked = (key: string, value: string | number) => {
    // searchParams.getAll trả về mảng các giá trị (vd: ['yonex', 'lining'])
    return searchParams.getAll(key).includes(String(value));
  };

  // 2. Hàm thay đổi URL khi user click
  const toggleFilter = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    const strValue = String(value);

    const currentValues = params.getAll(key);

    // Nếu đã có -> Xóa đi
    if (currentValues.includes(strValue)) {
      params.delete(key);
      // Add lại các giá trị còn lại (trừ giá trị vừa xóa)
      currentValues
        .filter((v) => v !== strValue)
        .forEach((v) => params.append(key, v));
    } 
    // Nếu chưa có -> Thêm vào
    else {
      params.append(key, strValue);
    }

    // Luôn reset về trang 1 khi filter thay đổi
    if (params.has("page")) {
      params.set("page", "1");
    }

    // Đẩy URL mới (scroll: false để không bị nhảy trang)
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // --- Filter danh sách hiển thị (Client logic) ---
  const categoryOptions = useMemo(() => {
    const list = data.categories ?? [];
    const q = qCategory.trim().toLowerCase();
    return q ? list.filter((c) => c.label.toLowerCase().includes(q)) : list;
  }, [data.categories, qCategory]);

  const brandOptions = useMemo(() => {
    const list = data.brands ?? [];
    const q = qBrand.trim().toLowerCase();
    return q ? list.filter((b) => b.label.toLowerCase().includes(q)) : list;
  }, [data.brands, qBrand]);

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-6 self-start">
      
      {/* 1. Categories */}
      {(data.categories?.length ?? 0) > 0 && (
        <Section icon="category" title="Danh mục">
          <div className="relative mb-3">
             <input
              value={qCategory}
              onChange={(e) => setQCategory(e.target.value)}
              placeholder="Tìm danh mục..."
              className="w-full h-9 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
            {categoryOptions.map((c) => (
              <CheckboxItem
                key={String(c.value)}
                label={c.label}
                // Check theo URL key "category" (hoặc "category_id" tùy backend bạn)
                checked={isChecked("category", c.value)} 
                onChange={() => toggleFilter("category", c.value)}
              />
            ))}
            {categoryOptions.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-2">Không tìm thấy danh mục</p>
            )}
          </div>
        </Section>
      )}

      {/* 2. Price Ranges */}
      {(data.priceRanges?.length ?? 0) > 0 && (
        <Section icon="attach_money" title="Khoảng giá">
          <div className="space-y-2">
            {data.priceRanges!.map((r) => (
              <CheckboxItem
                key={r.value}
                label={r.label}
                // Check theo URL key "price_range"
                checked={isChecked("price_range", r.value)}
                onChange={() => toggleFilter("price_range", r.value)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* 3. Discounts */}
      {(data.discounts?.length ?? 0) > 0 && (
        <Section icon="percent" title="Mức giảm giá">
          <div className="space-y-2">
            {data.discounts!.map((d) => (
              <CheckboxItem
                key={d}
                label={d >= 60 ? "Trên 60%" : `Giảm ${d}%`}
                highlight={isChecked("discount", d)}
                checked={isChecked("discount", d)}
                onChange={() => toggleFilter("discount", d)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* 4. Brands */}
      {(data.brands?.length ?? 0) > 0 && (
        <Section icon="branding_watermark" title="Thương hiệu">
          <div className="relative mb-3">
            <input
              value={qBrand}
              onChange={(e) => setQBrand(e.target.value)}
              placeholder="Tìm thương hiệu..."
              className="w-full h-9 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
            {brandOptions.map((b) => (
              <CheckboxItem
                key={b.value}
                label={b.label}
                checked={isChecked("brand", b.value)}
                onChange={() => toggleFilter("brand", b.value)}
              />
            ))}
             {brandOptions.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-2">Không tìm thấy thương hiệu</p>
            )}
          </div>
        </Section>
      )}
    </aside>
  );
}