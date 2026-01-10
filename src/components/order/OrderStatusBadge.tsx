import React from "react";
import { cn } from "@/lib/utils";

// Định nghĩa các key trạng thái có thể có
type OrderStatusKey = "pending" | "processing" | "shipping" | "completed" | "cancelled" | "returned" | string;

interface OrderStatusBadgeProps {
  status: OrderStatusKey; // Key trạng thái (vd: 'pending') để định màu
  label?: string;         // Chữ hiển thị (vd: 'Chờ xác nhận'). Nếu không truyền sẽ dùng status làm label
  className?: string;     // Class tùy chỉnh thêm nếu cần
}

export default function OrderStatusBadge({ status, label, className }: OrderStatusBadgeProps) {
  // Map màu sắc theo Key
  const statusStyles: Record<string, string> = {
    // 1. Chờ xác nhận (Vàng/Cam)
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/20",
    
    // 2. Đang xử lý / Đóng gói (Xanh dương)
    processing: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
    
    // 3. Đang giao hàng (Tím/Indigo)
    shipping: "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20",
    
    // 4. Hoàn thành (Xanh lá)
    completed: "bg-green-50 text-green-700 border-green-200 ring-green-600/20",
    
    // 5. Đã hủy (Đỏ)
    cancelled: "bg-red-50 text-red-700 border-red-200 ring-red-600/10",
    
    // 6. Trả hàng / Hoàn tiền (Xám)
    returned: "bg-gray-100 text-gray-700 border-gray-200 ring-gray-500/20",
  };

  // Lấy style dựa trên status, nếu không khớp key nào thì dùng màu mặc định (Xám)
  const badgeStyle = statusStyles[status] || "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ring-inset transition-colors whitespace-nowrap",
        badgeStyle,
        className
      )}
    >
      {/* Nếu có chấm tròn trạng thái thì bỏ comment dòng dưới */}
      {/* <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-60" /> */}
      {label || status}
    </span>
  );
}