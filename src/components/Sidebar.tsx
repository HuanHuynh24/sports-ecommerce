"use client";
import React, { useMemo, useState } from "react";
import type { FilterState, Category } from "@/types/types";

type Option = { value: string; label: string; subLabel?: string };

type SidebarData = {
  // ✅ CATEGORIES của bạn là { value: Category; label: string }[]
  categories?: Array<{ value: Category; label: string }>;
  discounts?: number[];
  priceRanges?: Option[];
  brands?: Option[];
};

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  data: SidebarData;
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#120707] p-5 rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
      <h3 className="text-[15px] font-extrabold uppercase border-b border-black/5 dark:border-white/10 pb-3 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-primary">
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function Sidebar({ filters, setFilters, data }: SidebarProps) {
  const [qCategory, setQCategory] = useState("");
  const [qBrand, setQBrand] = useState("");

  const toggleArray = <T extends keyof FilterState>(
    key: T,
    value: FilterState[T][number]
  ) => {
    setFilters((prev) => {
      const current = (prev[key] as any[]) ?? [];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

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

      {/* Discounts */}
      {(data.discounts?.length ?? 0) > 0 && (
        <Section icon="percent" title="Mức giảm giá">
          <div className="space-y-3">
            {data.discounts!.map((d) => (
              <label key={d} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.discounts.includes(d)}
                  onChange={() => toggleArray("discounts", d)}
                  className="w-5 h-5 rounded text-primary"
                />
                <span
                  className={`text-sm ${
                    filters.discounts.includes(d)
                      ? "font-bold text-primary"
                      : "text-gray-700"
                  }`}
                >
                  {d >= 60 ? "Trên 60%" : `Giảm ${d}%`}
                </span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Price */}
      {(data.priceRanges?.length ?? 0) > 0 && (
        <Section icon="attach_money" title="Khoảng giá">
          <div className="space-y-3">
            {data.priceRanges!.map((r) => (
              <label
                key={r.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.priceRanges.includes(r.value)}
                  onChange={() => toggleArray("priceRanges", r.value)}
                  className="w-5 h-5 rounded text-primary"
                />
                <span className="text-sm text-gray-700">{r.label}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Brands */}
      {(data.brands?.length ?? 0) > 0 && (
        <Section icon="branding_watermark" title="Thương hiệu">
          <input
            value={qBrand}
            onChange={(e) => setQBrand(e.target.value)}
            placeholder="Tìm thương hiệu..."
            className="mb-4 w-full h-10 px-3 rounded-lg border border-black/10 text-sm outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2">
            {brandOptions.map((b) => {
              const checked = (filters.brands ?? []).includes(b.value);

              return (
                <label
                  key={b.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setFilters((prev) => {
                        const curr = prev.brands ?? [];
                        const exists = curr.includes(b.value);
                        return {
                          ...prev,
                          brands: exists
                            ? curr.filter((x) => x !== b.value)
                            : [...curr, b.value],
                        };
                      })
                    }
                    className="w-5 h-5 rounded text-primary"
                  />
                  <span className="text-sm text-gray-700">{b.label}</span>
                </label>
              );
            })}
          </div>
        </Section>
      )}
    </aside>
  );
}
