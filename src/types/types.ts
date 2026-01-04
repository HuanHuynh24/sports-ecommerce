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
  [key: string]: string; // Ví dụ: { "Cán": "G5", "Trọng lượng": "4U" }
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
  location?: string; // Optional vì JSON mẫu không có, nhưng ProductCard có dùng
  tag?: string;      // Optional
  discount?: number; // Optional
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
