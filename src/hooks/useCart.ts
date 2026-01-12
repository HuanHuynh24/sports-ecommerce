import { create } from "zustand";
import { cartService } from "@/services/cart.service";
import { toast } from "react-hot-toast";
// Đảm bảo bạn import đúng Product hoặc ProductDetail tùy vào project của bạn
// Ở đây tôi dùng any cho Product để tránh lỗi type nếu ProductDetail khác Product,
// nhưng tốt nhất nên dùng Union Type: Product | ProductDetail
import { Product, CartItem } from "@/types/types"; 

// Định nghĩa Payload rõ ràng cho hàm addToCart
interface AddToCartPayload {
  product: Product | any; // Object sản phẩm (để lấy ID làm key loading)
  variant_id: number;     // ID biến thể cần thêm
  quantity: number;       // Số lượng
}

interface CartState {
  items: CartItem[];            
  cartCount: number;            
  loadingItems: Record<number, boolean>; 
  isLoading: boolean;          

  // Cập nhật signature hàm nhận payload object
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  fetchCart: () => Promise<void>; 
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cartCount: 0,
  loadingItems: {},
  isLoading: false,

  addToCart: async ({ product, variant_id, quantity }) => {
    // Kiểm tra trạng thái loading dựa trên ID sản phẩm cha
    if (get().loadingItems[product.id]) return;

    // Set loading
    set((state) => ({
      loadingItems: { ...state.loadingItems, [product.id]: true },
    }));

    // Log kiểm tra dữ liệu nhận được
    console.log("Adding to cart:", { productId: product.id, variantId: variant_id, quantity });

    const toastId = toast.loading("Đang thêm vào giỏ...");

    try {
      // Gọi API với variant_id chính xác
      const res = await cartService.addToCart({
        product_variant_id: variant_id,
        quantity: quantity,
      });

      if (res.status) {
        toast.success("Đã thêm vào giỏ hàng!", { id: toastId });
        // Cập nhật lại giỏ hàng từ server
        await get().fetchCart();
      } else {
        toast.error(res.message || "Không thể thêm sản phẩm.", { id: toastId });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Lỗi kết nối.", { id: toastId });
    } finally {
      // Tắt loading
      set((state) => {
        const newLoadingItems = { ...state.loadingItems };
        delete newLoadingItems[product.id];
        return { loadingItems: newLoadingItems };
      });
    }
  },

  fetchCart: async () => {
    // Chỉ set loading toàn cục nếu chưa có item nào (tránh flicker)
    if (get().items.length === 0) {
        set({ isLoading: true });
    }
    
    try {
      const res = await cartService.getCart();
      if (res.status && res.data) {
        set({ 
          items: res.data.items || [], 
          cartCount: res.data.total_items || 0 
        });
      } else {
          set({ items: [], cartCount: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      set({ items: [], cartCount: 0 });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: () => {
    set({ items: [], cartCount: 0 });
  }
}));