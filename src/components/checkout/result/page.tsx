"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Package,
  Home,
  Copy,
  RefreshCcw,
  PhoneCall,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosClient from "@/lib/axios-client";

function OrderResultContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Logic xác định trạng thái (giữ nguyên)
  const isSuccess =
    pathname?.includes("success") || searchParams.get("status") === "success";

  const orderCode = searchParams.get("code");
  const errorMessage =
    searchParams.get("message") || "Thanh toán thất bại hoặc đã bị hủy.";

  const [isLoaded, setIsLoaded] = useState(false);

  // --- STATE MỚI: Xử lý loading khi bấm thanh toán lại ---
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyCode = () => {
    if (orderCode) {
      navigator.clipboard.writeText(orderCode);
      toast.success("Đã sao chép mã đơn hàng!");
    }
  };

  // --- HÀM MỚI: Gọi API thanh toán lại ---
  const handleRetryPayment = async () => {
    if (!orderCode) {
      toast.error("Không tìm thấy mã đơn hàng");
      return;
    }

    setIsRetrying(true);
    try {
      // 1. Gọi API
      const response = await axiosClient.post(
        "orders/payment/vnpay/create-url",
        {
          order_code: orderCode,
        }
      );

      console.log("API trả về:", response);
      const paymentUrl = response?.data?.url;

      // 3. Kiểm tra và chuyển hướng
      if (paymentUrl && typeof paymentUrl === "string") {
        window.location.href = paymentUrl;
      } else {
        console.error("Cấu trúc phản hồi không đúng:", response);
        toast.error("Không lấy được đường dẫn thanh toán từ hệ thống.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Lỗi khi tạo link thanh toán"
      );
    } finally {
      setIsRetrying(false);
    }
  };

  // --- TRƯỜNG HỢP: THÀNH CÔNG (Giữ nguyên) ---
  if (isSuccess) {
    if (!orderCode)
      return <div className="text-center p-10">Thiếu mã đơn hàng</div>;

    return (
      <div
        className={`max-w-2xl mx-auto px-4 py-12 md:py-20 transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="bg-green-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-green-100">
              Cảm ơn bạn đã mua sắm tại SportsShop.
            </p>
          </div>
          <div className="p-8">
            {/* ... Nội dung thành công ... */}
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm mb-1">Mã đơn hàng của bạn</p>
              <div
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors group"
              >
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200 tracking-wider">
                  {orderCode}
                </span>
                <Copy className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
              <Link
                href={`/tai-khoan/don-hang/${orderCode}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-primary hover:text-primary transition-all dark:bg-transparent dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary"
              >
                <Package className="w-5 h-5" /> Chi tiết đơn
              </Link>
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-red-700 hover:-translate-y-0.5 transition-all"
              >
                <Home className="w-5 h-5" /> Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TRƯỜNG HỢP: THẤT BẠI (CẬP NHẬT NÚT RETRY) ---
  return (
    <div
      className={`max-w-xl mx-auto px-4 py-12 md:py-20 transition-all duration-700 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Header Đỏ */}
        <div className="bg-red-600 p-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Thanh toán thất bại
          </h1>
          <p className="text-red-100">Giao dịch chưa hoàn tất hoặc bị hủy.</p>
        </div>

        <div className="p-8">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-5 mb-8 text-center">
            <h3 className="text-red-800 dark:text-red-300 font-bold mb-2">
              Chi tiết lỗi
            </h3>
            <p className="text-red-600 dark:text-red-400 text-sm">
              {decodeURIComponent(errorMessage)}
            </p>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">
            Đừng lo lắng, đơn hàng <b>{orderCode}</b> của bạn đã được lưu. Bạn
            có thể thử thanh toán lại ngay bây giờ.
          </p>

          {/* Actions Failed */}
          <div className="flex flex-col gap-3">
            {/* NÚT THANH TOÁN LẠI */}
            <button
              onClick={handleRetryPayment}
              disabled={isRetrying}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-red-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isRetrying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo link thanh toán...
                </>
              ) : (
                <>
                  <RefreshCcw className="w-5 h-5" />
                  Thử thanh toán lại (VNPay)
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:19006868"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all dark:bg-transparent dark:border-gray-700 dark:text-gray-200"
              >
                <PhoneCall className="w-5 h-5" />
                Hỗ trợ
              </a>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-gray-400 transition-all dark:bg-transparent dark:border-gray-700 dark:text-gray-200"
              >
                <Home className="w-5 h-5" />
                Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderResultPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Đang xử lý kết quả...</p>
          </div>
        }
      >
        <OrderResultContent />
      </Suspense>
    </div>
  );
}
