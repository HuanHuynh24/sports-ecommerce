"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.set("page", "1"); // Reset về trang 1 khi sort
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      onChange={handleSortChange}
      defaultValue={searchParams.get("sort") || "newest"}
      className="border border-gray-300 text-sm rounded-lg p-2.5 outline-none focus:border-primary"
    >
      <option value="newest">Mới nhất</option>
      <option value="price_asc">Giá: Thấp đến Cao</option>
      <option value="price_desc">Giá: Cao đến Thấp</option>
    </select>
  );
}