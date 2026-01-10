import axiosClient from "@/lib/axios-client";

//Định nghĩa kiểu dữ liệu gửi lên (tùy backend của bạn)
interface RegisterPayload {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
}
export interface UserProfile {
  id: number | string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  //...các trường khác
}
interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  //Hàm đăng ký
  register: (payload: RegisterPayload) => {
    return axiosClient.post("/auth/register", payload);
  },

  //Hàm đăng nhập
  login: (payload: LoginPayload) => {
    return axiosClient.post("/auth/login", payload);
  },

  //Hàm đăng xuất
  logout: () => {
    return axiosClient.post("/auth/logout");
  },

  //Hàm đăng nhập với Google
  loginWithGoogle: (token: string) => {
    return axiosClient.post("/auth/google/redirect");
  },

  forgotPassword: (email: string) => {
    return axiosClient.post("/auth/forgot-password", { email });
  },

  // Đặt lại mật khẩu mới (kèm token và email)
  resetPassword: (payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    return axiosClient.post("/auth/reset-password", payload);
  },

  getMe: async (): Promise<UserProfile | null> => {
    try {
      //Gọi API GET. Trình duyệt tự động gửi Cookie đi kèm.
      //Lưu ý: Thay '/auth/me' bằng endpoint thực tế của Backend bạn
      const response = await axiosClient.get<any, any>("/auth/me");

      //Xử lý dữ liệu trả về tùy theo cấu trúc của Backend
      //Trường hợp 1: API trả về thẳng object User: { id: 1, name: "A"... }
      //return response; 

      //Trường hợp 2: API trả về bọc trong data: { status: true, data: { user... } }
      //(Giả sử axiosClient interceptor đã trả về response.data)
      return response.data || response; 

    } catch (error) {
      //Nếu lỗi 401 (Hết hạn cookie/Chưa đăng nhập), trả về null để UI biết
      //console.warn("Không lấy được thông tin user:", error);
      return null;
    }
  },
};
