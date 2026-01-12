"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/types";

//--- Type Definitions ---
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
  onClear,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  onClear?: () => void;
}) {
  return (
    <div
      className={`bg-white dark:bg-[#120707] p-5 rounded-xl border border-black/5 dark:border-white/10 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 mb-4">
        <h3 className="text-[15px] font-extrabold uppercase flex items-center gap-2 text-gray-900 dark:text-white mb-0">
          <span className="material-symbols-outlined text-[20px] text-primary">
            {icon}
          </span>
          {title}
        </h3>

        {onClear && (
          <button
            onClick={onClear}
            className="text-xs font-medium text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:underline transition-colors flex items-center gap-0.5"
            title="Xóa bộ lọc này"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
            Xóa
          </button>
        )}
      </div>
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
    <label
      className={`flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type={inputType}
        checked={checked}
        onChange={!disabled ? onChange : undefined}
        className={`w-5 h-5 border-gray-300 text-primary focus:ring-primary dark:bg-black/20 dark:border-white/20 ${
          inputType === "radio" ? "rounded-full" : "rounded"
        }`}
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

  const [qBrand, setQBrand] = useState("");

  const hasPriceFilter = searchParams.has("price_range");
  const hasBrandFilter = searchParams.has("brand");
  // const hasDiscountFilter = searchParams.has("discount");

  // 2. LOGIC XÓA FILTER THEO SECTION
  const clearSectionFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!params.has(key)) return;

    params.delete(key);

    if (params.has("page")) params.set("page", "1");

    if (key === "brand") setQBrand("");

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  //--- Logic xử lý URL  ---
  const isChecked = (key: string, value: string | number) => {
    return searchParams.getAll(key).includes(String(value));
  };

  const toggleFilter = (
    key: string,
    value: string | number,
    isSingleSelect: boolean = false
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const strValue = String(value);

    if (isSingleSelect) {
      const currentValue = params.get(key);
      if (currentValue === strValue) {
        params.delete(key);
      } else {
        params.set(key, strValue);
      }
    } else {
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

    if (params.has("page")) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  //--- Filter danh sách Brand  ---
  const brandOptions = useMemo(() => {
    const list = data.brands ?? [];
    const q = qBrand.trim().toLowerCase();
    return q ? list.filter((b) => b.label.toLowerCase().includes(q)) : list;
  }, [data.brands, qBrand]);

  return (
    <aside className="w-full shrink-0 space-y-6 self-start">
      {(data.priceRanges?.length ?? 0) > 0 && (
        <Section
          icon="attach_money"
          title="Khoảng giá"
          onClear={
            hasPriceFilter ? () => clearSectionFilter("price_range") : undefined
          }
        >
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

      {/* Thương hiệu */}
      {(data.brands?.length ?? 0) > 0 && (
        <Section
          icon="branding_watermark"
          title="Thương hiệu"
          onClear={
            hasBrandFilter ? () => clearSectionFilter("brand") : undefined
          }
        >
          <div className="relative mb-3">
            <input
              value={qBrand}
              onChange={(e) => setQBrand(e.target.value)}
              placeholder="Tìm thương hiệu..."
              className="w-full h-9 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white placeholder:text-gray-400"
            />

            {qBrand && (
              <button
                onClick={() => setQBrand("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  close
                </span>
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
            {brandOptions.map((b) => (
              <CheckboxItem
                key={b.value}
                label={b.label}
                inputType="radio"
                checked={isChecked("brand", b.value)}
                onChange={() => toggleFilter("brand", b.value, true)}
                disabled={isPending}
              />
            ))}
            {brandOptions.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-2">
                Không tìm thấy thương hiệu
              </p>
            )}
          </div>
        </Section>
      )}
    </aside>
  );
}
