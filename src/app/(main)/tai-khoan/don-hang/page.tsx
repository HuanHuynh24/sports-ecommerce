"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { orderService } from "@/services/order.service";
import { OrderDetail } from "@/types/order";
import { formatCurrency } from "@/lib/utils";
import { Package, ChevronRight } from "lucide-react";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";

export default function OrderHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  // Lấy page từ URL (mặc định là 1)
  const currentPage = Number(searchParams.get("page")) || 1;

  // Fetch Data
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const res = await orderService.getOrders(currentPage);
      // @ts-expect-error
      if (res.status) {
        // @ts-expect-error
        setOrders(res.data.data);
        // @ts-expect-error
        setMeta(res.data.meta);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [currentPage]);

  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.last_page) {
      router.push(`/tai-khoan/don-hang?page=${newPage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lịch sử mua hàng
          </h1>
        </div>

        {/* Tab trạng thái (UI Mockup) */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-gray-200 dark:border-gray-800 no-scrollbar">
          {["Tất cả", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"].map(
            (tab, idx) => (
              <button
                key={tab}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  idx === 0
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          // Empty State
          <div className="text-center py-16 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy khám phá các sản phẩm và đặt hàng ngay nhé.
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          // Order List
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-black/20 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Mã đơn hàng
                      </p>
                      <span className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {order.code}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      {order.created_at}
                    </span>
                    <OrderStatusBadge
                      status={order.status.key}
                      label={order.status.label}
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Tổng tiền:
                      <span className="font-bold text-red-600 text-lg ml-1">
                        {formatCurrency(order.financial?.total || 0)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 italic">
                      {order.payment?.method}
                    </p>
                  </div>

                  <Link
                    href={`/tai-khoan/don-hang/${order.code}`}
                    className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-primary text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-all"
                  >
                    Xem chi tiết <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && orders.length > 0 && meta.last_page > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-white/5"
            >
              Trước
            </button>
            <span className="px-4 py-1 font-medium text-sm flex items-center">
              Trang {currentPage} / {meta.last_page}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === meta.last_page}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-white/5"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}