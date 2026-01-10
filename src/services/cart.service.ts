import axiosClient from "@/lib/axios-client";

//Định nghĩa lại Type cho Payload để code chặt chẽ hơn
export const cartService = {
  //1. Lấy danh sách (GET)
  getCart: () => {
    return axiosClient.get("/cart");
  },

  //2. Thêm vào giỏ (POST)
  addToCart: (payload: { product_variant_id: number; quantity: number }) => {
    return axiosClient.post("/cart/items", payload);
  },

  //3. Cập nhật số lượng (PUT) - Endpoint: /items/{item_id}
  updateQuantity: (itemId: number, quantity: number) => {
    return axiosClient.put(`/cart/items/${itemId}`, { quantity });
  },

  //4. Chọn/Bỏ chọn sản phẩm (PUT) - Endpoint: /select
  //Trả về Cart mới gồm total_price và items
  updateSelection: (itemIds: number[], selected: boolean) => {
    return axiosClient.put("/cart/select", {
      item_ids: itemIds,
      selected: selected,
    });
  },

  //5. Xóa 1 sản phẩm (DELETE) - Endpoint: /items/{item_id}
  removeItem: (itemId: number) => {
    return axiosClient.delete(`/cart/items/${itemId}`);
  },

  //6. Xóa tất cả/Làm trống giỏ (DELETE) - Endpoint: /clear
  clearCart: () => {
    return axiosClient.delete("/cart/clear");
  },
};