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
    return axiosClient.post("/v1/auth/register", payload);
  },

  // Hàm đăng nhập
  login: (payload: LoginPayload) => {
    return axiosClient.post("/v1/auth/login", payload);
  },

  // Hàm đăng xuất
  logout: () => {
    return axiosClient.post("/v1/auth/logout");
  },

  // Hàm đăng nhập với Google
  loginWithGoogle: (token: string) => {
    return axiosClient.post("/v1/auth/google/redirect");
  },
};
