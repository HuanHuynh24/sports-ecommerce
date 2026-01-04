import axiosClient from "@/lib/axios-client";
import type { ApiResponse, ProductDetail } from "@/types/types";

export const productService = {
  // Lấy danh sách sản phẩm với phân trang
  // GET /v1/products?page={page}&limit={limit}
  getProducts: () => {
    const res = axiosClient.get("/v1/products");
    return res;
  },
  // Lấy chi tiết sản phẩm theo ID
  // GET /v1/products/{id}
  getDetail: (id: number | string) => {
    return axiosClient
      .get<ApiResponse<ProductDetail>>(`/v1/products/1`)
      .then((res) => res.data);
  },
};
