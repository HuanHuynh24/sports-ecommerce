export type Category = "badminton" | "pickleball" | "tennis";

export interface Branch {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  originalPrice: number;
  currentPrice: number;
  image: string;
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