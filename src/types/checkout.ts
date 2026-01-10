export interface CartItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface CheckoutFormData {
  email: string;
  newsletter: boolean;
  fullName: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
}

export type ShippingType = "standard" | "express";
export type PaymentType = "cod" | "banking" | "card";