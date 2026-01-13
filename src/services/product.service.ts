// file: src/services/product.service.ts
import axiosClient from "@/lib/axios-client";

// Định nghĩa Type trả về từ API dựa trên mô tả của bạn
export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

export interface Category {
  id: number;
  name: string;
  // thêm các trường khác nếu có
}

// Wrapper response chuẩn (dựa trên mô tả JSON của bạn)
interface ApiListResponse<T> {
  status: boolean;
  message: string;
  data: T[];
}

export const productService = {
  getProducts: (params: any) => {
    return axiosClient.get("/products", { params });
  },

  getDetail: (id: number | string) => {
    return axiosClient.get(`/products/${id}`).then((res) => res.data);
  },

  // Cập nhật: Trả về data đúng kiểu
  getBrands: async () => {
    return axiosClient.get<ApiListResponse<Brand>>("/brands").then((res) => res.data);
  },

  // Cập nhật: Trả về data đúng kiểu
  getCategories: async () => {
    return axiosClient.get<ApiListResponse<Category>>("/categories").then((res) => res.data);
  },
};