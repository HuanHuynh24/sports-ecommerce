"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { orderService } from "@/services/order.service";
import { OrderDetail } from "@/types/order";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  PackageX,
  CalendarDays,
  Receipt,
  Package,
} from "lucide-react";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderCode = params.code as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderCode) return;
      const res = await orderService.getOrderDetail(orderCode);
      
      // @ts-expect-error: API response structure might vary
      if (res.status && res.data) {
        // @ts-expect-error: Data structure alignment
        setOrder(res.data);
      } else {
        toast.error("Không tìm thấy đơn hàng");
        router.push("/tai-khoan/don-hang");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderCode, router]);

  // 2. Handle Cancel
  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    setCancelling(true);
    const res = await orderService.cancelOrder(orderCode);

    if (res.status) {
      toast.success("Đã hủy đơn hàng thành công");
      // Optimistic update: Cập nhật thủ công status
      setOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: {
            ...prev.status,
            key: "cancelled",
            label: "Đã hủy",
            color: "danger"
          }
        };
      });
    } else {
      // @ts-expect-error
      toast.error(res.message || "Hủy thất bại");
    }
    setCancelling(false);
  };

  // --- Render Loading ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/tai-khoan/don-hang"
            className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Chi tiết đơn hàng #{order.code}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Items List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày đặt hàng</p>
                <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  {/* Sử dụng trực tiếp chuỗi từ API: "09/01/2026 16:01" */}
                  {order.created_at}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                <OrderStatusBadge
                  status={order.status.key}
                  label={order.status.label}
                />
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
                <h3 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <Package className="w-4 h-4" /> 
                  Sản phẩm ({Array.isArray(order.items) ? order.items.length : 0})
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="p-4 flex gap-4">
                      {/* Ảnh sản phẩm */}
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={item.image || "https://placehold.co/150"}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Phân loại: <span className="font-medium">{item.variant_name}</span>
                        </p>
                        <div className="flex justify-between items-end mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            x{item.quantity}
                          </span>
                          <span className="font-bold text-primary">
                            {formatCurrency(item.unit_price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    Không có thông tin chi tiết sản phẩm.
                  </div>
                )}
              </div>
            </div>

            {/* Total Calculation (SỬA DỮ LIỆU TÀI CHÍNH) */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tạm tính</span>
                  <span className="text-gray-900 dark:text-gray-300 font-medium">
                    {formatCurrency(order.financial?.subtotal || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-gray-900 dark:text-gray-300 font-medium">
                    {formatCurrency(order.financial?.shipping_fee || 0)}
                  </span>
                </div>
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    {formatCurrency(order.financial?.total || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Info */}
          <div className="space-y-6">
            
            {/* Receiver Info (SỬA DỮ LIỆU NGƯỜI NHẬN) */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold mb-4 border-b pb-2 dark:border-gray-700 text-gray-900 dark:text-white">
                Thông tin nhận hàng
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Người nhận</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.receiver_info?.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Số điện thoại</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.receiver_info?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Địa chỉ</p>
                    <p className="font-medium leading-snug text-gray-900 dark:text-white">
                      {order.receiver_info?.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold mb-4 border-b pb-2 dark:border-gray-700 text-gray-900 dark:text-white">
                Thanh toán
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Phương thức</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.payment?.method}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Receipt className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">
                      Trạng thái thanh toán
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold rounded ${
                        order.payment?.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"
                      }`}
                    >
                      {order.payment?.status === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Cancel Button */}
            {order.status.key === "pending" && (
              <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 mb-4">
                  Bạn chỉ có thể hủy đơn hàng khi đơn hàng chưa được cửa hàng
                  xác nhận.
                </p>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelling ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <PackageX className="w-4 h-4" />
                  )}
                  {cancelling ? "Đang xử lý..." : "Hủy đơn hàng"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}