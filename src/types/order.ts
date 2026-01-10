export interface OrderDetail {
  id: number;
  code: string;
  // Cấu trúc mới nested object
  receiver_info: {
    name: string;
    phone: string;
    address: string;
  };
  financial: {
    subtotal: number;
    shipping_fee: number;
    total: number; // <-- Dữ liệu tiền nằm ở đây
  };
  status: {
    key: string;   // 'pending'
    label: string; // 'Chờ xác nhận'
    color: string; // 'warning'
  };
  payment: {
    method: string;
    status: string;
  };
  created_at: string;
  items?: any[]; // List API không trả về items, nên để optional (?)
}