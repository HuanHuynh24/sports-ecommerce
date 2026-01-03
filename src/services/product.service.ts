import axiosClient from "@/lib/axios-client";
import type { ApiResponse, ProductDetail } from "@/types/types";



export const productService = {

  // Lấy chi tiết sản phẩm theo ID
  // GET /v1/products/{id}
  getDetail: (id: number | string) => {
    return  axiosClient.get<ApiResponse<ProductDetail>>(`/v1/products/1`).then(res => res.data);
  },

};