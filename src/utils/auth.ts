export const loginSuccess = (data: any) => {
  // 1. Lưu vào Storage
  localStorage.setItem("user_info", JSON.stringify(data));

  // 2. Bắn sự kiện để Header cập nhật NGAY LẬP TỨC
  window.dispatchEvent(new Event("auth:changed"));
};

export const logout = () => {
  // 1. Xóa Storage
  localStorage.removeItem("user_info");

  // 2. Bắn sự kiện
  window.dispatchEvent(new Event("auth:changed"));
  
  // 3. Redirect (tuỳ chọn)
  // window.location.href = "/login"; 
};