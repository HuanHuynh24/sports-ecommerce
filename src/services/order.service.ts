import axiosClient from "@/lib/axios-client"; //Đảm bảo đường dẫn import đúng file bạn vừa gửi

//--- 1. Định nghĩa Types (Dựa trên tài liệu BE) ---

export interface CreateOrderPayload {
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  payment_method: string;
  note?: string;
}

//Type phản hồi thành công từ BE
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

//Type phản hồi lỗi từ BE
export interface OrderErrorResponse {
  status: false;
  message: string;
}

//--- 2. Service ---

export const orderService = {
  /**
   * Tạo đơn hàng mới
   * Endpoint: POST /orders
   */
  createOrder: async (payload: CreateOrderPayload): Promise<OrderSuccessResponse | OrderErrorResponse> => {
    try {
      //Lấy token (giả sử lưu ở localStorage, bạn sửa lại nếu lưu ở cookie/store khác)
      const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

      const response = await axiosClient.post<any, OrderSuccessResponse>("/orders", payload, {
        headers: {
          //BE yêu cầu Bearer Token
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      //Vì interceptor của bạn đã return response.data, 
      //nên biến 'response' ở đây chính là data JSON từ server.
      return response;

    } catch (error: any) {
      //Xử lý lỗi từ Axios
      console.error("Create Order Error:", error);

      //Trường hợp BE trả về 400 Bad Request kèm message (ví dụ: Hết hàng)
      if (error.response && error.response.data) {
        return error.response.data as OrderErrorResponse;
      }

      //Lỗi mạng hoặc lỗi khác
      return {
        status: false,
        message: "Lỗi kết nối hoặc hệ thống đang bận. Vui lòng thử lại sau.",
      };
    }
  },
};