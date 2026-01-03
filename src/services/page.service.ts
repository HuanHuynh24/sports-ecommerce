import CategoryGrid from "@/components/CategoryGrid";
import axiosClient from "@/lib/axios-client";

export const pageVotCauLong = {
  // Hàm lấy danh sách trang (pages)
  getPages: async (searchParams: any) => {
    const params = {
      category_id : 1,
      // page: searchParams.page || 1,
      // limit: 12,
      // sort_by: searchParams.sort_by || "created_at",
      // order: searchParams.order || "desc",
      // brand_id: searchParams.brand, // URL: ?brand=1,2
      // mapping thêm các filter khác...
    };
    return await axiosClient.get("/v1/products", { params });
  },
};
