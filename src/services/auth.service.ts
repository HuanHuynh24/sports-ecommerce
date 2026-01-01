import axiosClient from "@/lib/axios-client";

// Định nghĩa kiểu dữ liệu gửi lên (tùy backend của bạn)
interface RegisterPayload {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  // Hàm đăng ký
  register: (payload: RegisterPayload) => {
    return axiosClient.post("/auth/register", payload);
  },

  // Hàm đăng nhập
  login: (payload: LoginPayload) => {
    return axiosClient.post("/auth/login", payload);
  },
};
