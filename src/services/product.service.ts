import axiosClient from "@/lib/axios-client";
import type { ApiResponse, ProductDetail } from "@/types/types";

export const productService = {
  //Lấy danh sách sản phẩm với phân trang
  //GET  /products?page={page}&limit={limit}
  getProducts: () => {
    const res = axiosClient.get("/products");
    return res;
  },
  //Lấy chi tiết sản phẩm theo ID
  //GET  /products/{id}
  getDetail:  (id: number | string) => {
    return axiosClient
      .get<ApiResponse<ProductDetail>>(`/products/${id}`)
      .then((res) => res.data);
  },

  getBrands: async () => {
    return axiosClient.get("/brands"); 
  },

  getCategories: async () => {
    return axiosClient.get("/categories");
  },
};
