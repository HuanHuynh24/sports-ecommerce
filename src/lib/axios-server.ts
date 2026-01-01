import axios from 'axios';
import { cookies } from 'next/headers';

// Tạo instance riêng cho Server không có interceptor phức tạp
const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1000000,
});

// Hàm wrapper để gọi API trong Server Component
export const serverApi = async (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) => {
  const cookieStore = cookies();
  
  // Lấy tất cả cookie từ browser gửi lên và đóng gói thành string header
  // Backend cần cookie nào thì nó sẽ có cookie đó (vd: accessToken)
  const cookieHeader = cookieStore.toString(); 

  try {
    const response = await axiosServer({
      url,
      method,
      data,
      headers: {
        // Thủ công gắn cookie vào header request
        Cookie: cookieHeader, 
      },
    });
    return response.data;
  } catch (error: any) {
    // Xử lý lỗi server side (tránh làm crash app)
    console.error(`Server API Error [${method} ${url}]:`, error?.response?.data || error.message);
    return null; // Hoặc throw error tùy logic
  }
};