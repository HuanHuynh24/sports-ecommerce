export type Category = "badminton" | "pickleball" | "tennis";

export interface Branch {
  id: string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  original_price: number;
  price: number;
  thumbnail: string;
  tag?: string;
  discount?: number;
  category: Category;
  branchId?: string;
  branch?: Branch;
}

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  tag?: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface FilterState {
  categories: Category[];
  discounts: number[];
  priceRanges: string[];
  brands?: string[];
}

export enum SortOption {
  Featured = "Nổi bật nhất",
  PriceAsc = "Giá tăng dần",
  PriceDesc = "Giá giảm dần",
  Newest = "Hàng mới về",
  BestSeller = "Bán chạy nhất",
}



export interface Attribute {
  [key: string]: string; //Ví dụ: { "Cán": "G5", "Trọng lượng": "4U" }
}

export interface Variant {
  id: number;
  sku: string;
  attributes: Attribute;
  price: number;
  stock_qty: number;
  image: string | null;
}

export interface ProductDetail {
  id: number;
  name: string;
  sku: string;
  thumbnail: string;
  price: number;
  original_price: number;
  description: string;
  category: { id: number; name: string };
  brand: { id: number; name: string };
  images: Array<{ id: number; url: string }>;
  variants: Variant[];
  location?: string; //Optional vì JSON mẫu không có, nhưng ProductCard có dùng
  tag?: string;      //Optional
  discount?: number; //Optional
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
export interface CartItem {
  id: string;
  name: string;
  category: string;
  tag?: string;
  spec?: string;
  price: number;
  originalPrice?: number;
  qty: number;
  imageUrl: string;
};



//types/index.ts

//1. Định nghĩa item trong giỏ hàng
export interface CartItem {
  id: number | string;      //ID sản phẩm (hoặc ID của biến thể sản phẩm)
  name: string;             //Tên sản phẩm
  imageUrl: string;         //Ảnh đại diện (thumbnail)
  price: number;            //Giá bán (đã giảm giá nếu có)
  quantity: number;         //Số lượng mua
  
  //Các trường tùy chọn (Optional)
  variant?: string;         //Ví dụ: "Size 40", "Màu Đỏ", "4U"
  slug?: string;            //Để link về trang chi tiết sản phẩm
  stock_qty?: number;       //Để validate tồn kho tối đa có thể mua
  
  //TRƯỜNG QUAN TRỌNG CHO CHECKOUT
  is_selected: boolean;     //true: User chọn mua món này, false: Để lại mua sau
}

//2. Định nghĩa phương thức vận chuyển (Dùng trong OrderSummary cũ)
export enum ShippingMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
}

//3. Định nghĩa trạng thái đơn hàng (Nếu cần dùng sau này)
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

//4. Định nghĩa Payload gửi lên API tạo đơn hàng (Khớp với CheckoutPage)
export interface CreateOrderPayload {
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  payment_method: string;
  note?: string;
}