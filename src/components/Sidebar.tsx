"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/types";

//--- 1. Cập nhật Type: value chấp nhận string hoặc number ---
type Option = { value: string | number; label: string; subLabel?: string };

type SidebarData = {
  categories?: Array<{ value: Category; label: string }>;
  discounts?: number[];
  priceRanges?: Option[];
  brands?: Option[];
};

interface SidebarProps {
  data: SidebarData;
}

//--- Sub-components ---
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
  disabled = false,
  inputType = "checkbox",
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  highlight?: boolean;
  disabled?: boolean;
  inputType?: "checkbox" | "radio";
}) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type={inputType}
        checked={checked}
        onChange={!disabled ? onChange : undefined}
        className={`w-5 h-5 border-gray-300 text-primary focus:ring-primary dark:bg-black/20 dark:border-white/20 ${inputType === 'radio' ? 'rounded-full' : 'rounded'}`}
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

//--- Main Component ---
export default function Sidebar({ data }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  //State local tìm kiếm brand
  const [qBrand, setQBrand] = useState("");

  //--- Logic xử lý URL ---
  
  const isChecked = (key: string, value: string | number) => {
    //Chuyển value về string để so sánh với URL params
    return searchParams.getAll(key).includes(String(value));
  };

  const toggleFilter = (key: string, value: string | number, isSingleSelect: boolean = false) => {
    const params = new URLSearchParams(searchParams.toString());
    const strValue = String(value);

    if (isSingleSelect) {
      //--- SINGLE SELECT (Giá & Thương hiệu) ---
      const currentValue = params.get(key);
      if (currentValue === strValue) {
        params.delete(key); //Bấm lại thì bỏ chọn
      } else {
        params.set(key, strValue); //Chọn mới thì ghi đè
      }
    } else {
      //--- MULTI SELECT (Mặc định cho các loại khác nếu cần) ---
      const currentValues = params.getAll(key);
      if (currentValues.includes(strValue)) {
        params.delete(key);
        currentValues
          .filter((v) => v !== strValue)
          .forEach((v) => params.append(key, v));
      } else {
        params.append(key, strValue);
      }
    }

    //Reset về trang 1
    if (params.has("page")) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  //--- Filter danh sách Brand (Client logic) ---
  const brandOptions = useMemo(() => {
    const list = data.brands ?? [];
    const q = qBrand.trim().toLowerCase();
    return q ? list.filter((b) => b.label.toLowerCase().includes(q)) : list;
  }, [data.brands, qBrand]);

  return (
    <aside className="w-full shrink-0 space-y-6 self-start">
      
      {/* 2. Khoảng giá (SINGLE SELECT) */}
      {(data.priceRanges?.length ?? 0) > 0 && (
        <Section icon="attach_money" title="Khoảng giá">
          <div className="space-y-2">
            {data.priceRanges!.map((r) => (
              <CheckboxItem
                key={r.value}
                label={r.label}
                inputType="radio"
                checked={isChecked("price_range", r.value)}
                onChange={() => toggleFilter("price_range", r.value, true)}
                disabled={isPending}
              />
            ))}
          </div>
        </Section>
      )}

      {/* 3. Mức giảm giá (Giữ nguyên Multi hoặc đổi sang Single tuỳ bạn) */}

      {/* 4. Thương hiệu (ĐÃ CẬP NHẬT: SINGLE SELECT) */}
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
                //Dùng inputType="radio" để người dùng hiểu là chỉ chọn 1
                inputType="radio"
                checked={isChecked("brand", b.value)}
                //Truyền true vào tham số thứ 3 để kích hoạt Single Select
                onChange={() => toggleFilter("brand", b.value, true)}
                disabled={isPending}
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