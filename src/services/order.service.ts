import axiosClient from "@/lib/axios-client";

// --- 1. Định nghĩa Types ---

export interface CreateOrderPayload {
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  payment_method: string;
  note?: string;
}

export interface OrderSuccessResponse {
  status: true;
  message: string;
  data: {
    id: number;
    code: string;
    receiver_name: string;
    total: number;
    payment_status: string;
    status: string;
    created_at: string;
  };
}

export interface OrderListResponse {
  status: boolean;
  message: string;
  data: {
    data: OrderDetail[]; // Mảng các đơn hàng
    meta: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
}

export interface OrderErrorResponse {
  status: false;
  message: string;
}

// --- 2. Service ---

export const orderService = {
  /**
   * Tạo đơn hàng mới
   * Endpoint: POST /orders
   */
  createOrder: async (payload: CreateOrderPayload): Promise<OrderSuccessResponse | OrderErrorResponse> => {
    try {
      // axiosClient đã có 'withCredentials: true', 
      // trình duyệt sẽ tự động kẹp Cookie HttpOnly vào request này.
      const response = await axiosClient.post<any, OrderSuccessResponse>("/orders", payload);

      return response;

    } catch (error: any) {
      console.error("Create Order Error:", error);

      // Xử lý lỗi 400/401 từ BE trả về
      if (error.response && error.response.data) {
        return error.response.data as OrderErrorResponse;
      }

      return {
        status: false,
        message: "Lỗi kết nối hoặc hệ thống đang bận. Vui lòng thử lại sau.",
      };
    }
  },
  // 1. Lấy chi tiết đơn hàng
  getOrderDetail: async (code: string) => {
    try {
      const res = await axiosClient.get<{ status: boolean; data: OrderDetail }>(`/orders/${code}`);
      return res; // Trả về { status: true, data: ... }
    } catch (error: any) {
      console.error("Get Order Detail Error", error);
      return {
        status: false,
        message: error?.response?.data?.message || "Không tìm thấy đơn hàng",
      };
    }
  },

  // 2. Hủy đơn hàng
  cancelOrder: async (code: string) => {
    try {
      const res = await axiosClient.put(`/orders/${code}/cancel`);
      return res;
    } catch (error: any) {
      return {
        status: false,
        message: error?.response?.data?.message || "Không thể hủy đơn hàng này",
      };
    }
  },

  // 3. Lấy danh sách đơn hàng (có phân trang)
  getOrders: async (page = 1, limit = 10) => {
    try {
      const res = await axiosClient.get<any, OrderListResponse>("/orders", {
        params: { page, limit },
      });
      return res;
    } catch (error: any) {
      console.error("Get Orders Error", error);
      return {
        status: false,
        message: "Không thể tải lịch sử đơn hàng",
        data: { data: [], meta: { current_page: 1, last_page: 1, total: 0 } }
      } as OrderListResponse;
    }
  },
};