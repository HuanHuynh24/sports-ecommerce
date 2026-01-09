//src/utils/auth.ts

export const loginSuccess = (responseData: any) => {
  console.log("💾 Dữ liệu login response:", responseData);

  //1. Với HttpOnly Cookie, ta KHÔNG quan tâm token ở đây.
  //Ta chỉ quan tâm thông tin User để hiển thị UI.
  
  //Tìm object user trong response (tùy cấu trúc BE trả về)
  const user = responseData.user || responseData.data?.user || responseData.data;

  if (!user) {
    console.error("❌ Login thành công nhưng không thấy thông tin User trong response!");
    //Trường hợp này: API Login chỉ set Cookie mà không trả về info user.
    //Bạn cần gọi thêm API /auth/me ngay lập tức ở bước sau.
    return;
  }

  //2. Chỉ lưu thông tin User vào LocalStorage (để Header hiển thị tên)
  //KHÔNG LƯU TOKEN
  localStorage.setItem("user_info", JSON.stringify(user)); 

  //3. Bắn sự kiện để Header cập nhật
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event("auth:changed"));
  }
};

export const logout = () => {
  //Với HttpOnly, bạn cần gọi API Logout để server xóa cookie
  //Ở client, chỉ cần xóa thông tin hiển thị
  localStorage.removeItem("user_info");
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event("auth:changed"));
  }
};