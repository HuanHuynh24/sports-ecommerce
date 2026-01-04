import axiosClient from "@/lib/axios-client";

export const pageVotCauLong = {
  // Hàm lấy danh sách trang (pages)
  getPages:  (searchParams: any) => {
    const params = {
      category_id : 1,
      // page: searchParams.page || 1,
      // limit: 12,
      // sort_by: searchParams.sort_by || "created_at",
      // order: searchParams.order || "desc",
      // brand_id: searchParams.brand, // URL: ?brand=1,2
      // mapping thêm các filter khác...
    };
    const res =  axiosClient.get("/v1/products", { params });
    console.log("API Response:", res);
    return res;
  },
};
