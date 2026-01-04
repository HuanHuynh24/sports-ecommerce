import { create } from "zustand";
import { cartService } from "@/services/cart.service";
import { toast } from "react-hot-toast";
import { Product } from "@/types/types";

interface CartState {
  cartCount: number;
  loadingItems: Record<number, boolean>;

  addToCart: (product: Product, quantity?: number) => Promise<void>;
  fetchCartCount: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartCount: 0,
  loadingItems: {},

  addToCart: async (product: Product, quantity = 1) => {
    // 1. Chặn spam click
    if (get().loadingItems[product.id]) return;

    // 2. Set loading
    set((state) => ({
      loadingItems: { ...state.loadingItems, [product.id]: true },
    }));

    const toastId = toast.loading("Đang thêm vào giỏ...");

    try {
      const res = await cartService.addToCart({
        product_variant_id: product.id,
        quantity: quantity,
      });

      if (res.status) {
        toast.success("Đã thêm vào giỏ hàng!", { id: toastId });

        // --- QUAN TRỌNG: GỌI FETCH LẠI NGAY LẬP TỨC ---
        // Thay vì tự cộng (+ quantity), hãy gọi API để lấy số chính xác từ Server
        // Điều này giúp tránh sai lệch nếu mạng lag hoặc logic server khác client
        await get().fetchCartCount();
      } else {
        // toast.error(res.message || "Không thể thêm sản phẩm.", { id: toastId });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Lỗi kết nối.", { id: toastId });
    } finally {
      // 3. Tắt loading
      set((state) => {
        const newLoadingItems = { ...state.loadingItems };
        delete newLoadingItems[product.id];
        return { loadingItems: newLoadingItems };
      });
    }
  },

  fetchCartCount: async () => {
    try {
      const res = await cartService.getCart();
      if (res.data) {
        set({ cartCount: res.data.total_items || 0 });
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  },
}));
