//hooks/useCart.ts
import { create } from "zustand";
import { cartService } from "@/services/cart.service";
import { toast } from "react-hot-toast";
import { Product, CartItem } from "@/types/types"; 

interface CartState {
  items: CartItem[];            
  cartCount: number;            
  loadingItems: Record<number, boolean>; 
  isLoading: boolean;          

  addToCart: (product: Product, quantity?: number) => Promise<void>;
  fetchCart: () => Promise<void>; 
  clearCart: () => void; //Reset UI local
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cartCount: 0,
  loadingItems: {},
  isLoading: false,

  addToCart: async (product: Product, quantity = 1) => {
    if (get().loadingItems[product.id]) return;

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
        //Gọi fetchCart để cập nhật số lượng chính xác từ server
        await get().fetchCart();
      } else {
        toast.error(res.message || "Không thể thêm sản phẩm.", { id: toastId });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Lỗi kết nối.", { id: toastId });
    } finally {
      set((state) => {
        const newLoadingItems = { ...state.loadingItems };
        delete newLoadingItems[product.id];
        return { loadingItems: newLoadingItems };
      });
    }
  },

  fetchCart: async () => {
    //Chỉ set loading true nếu chưa có items (để tránh flicker khi add to cart)
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
          //Trường hợp lỗi hoặc data null, reset về rỗng
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