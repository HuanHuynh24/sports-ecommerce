import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 100000,
  //QUAN TRỌNG: Cho phép gửi cookie HttpOnly đi kèm request
  withCredentials: true, 
});

//Interceptor Response: Xử lý data và lỗi toàn cục
axiosClient.interceptors.response.use(
  (response) => {
    //Trả về data gọn gàng
    return response.data;
  },
  (error) => {
    //Xử lý lỗi chung
    if (error.response) {
      const status = error.response.status;
      
      //Nếu lỗi 401 (Unauthorized) -> Có thể redirect về trang login
      if (status === 401) {
        if (typeof window !== 'undefined') {
          //window.location.href = '/login'; 
          console.warn('Phiên đăng nhập hết hạn');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;