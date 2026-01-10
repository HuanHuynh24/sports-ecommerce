"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight, Home, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import { formatCurrency } from "@/lib/utils"; 

// Component nội dung chính (bọc trong Suspense để dùng useSearchParams)
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("code");
  
  // Giả lập loading nhẹ để tạo cảm giác xử lý
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Hiệu ứng fade-in khi vào trang
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyCode = () => {
    if (orderCode) {
      navigator.clipboard.writeText(orderCode);
      toast.success("Đã sao chép mã đơn hàng!");
    }
  };

  if (!orderCode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl">warning</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-gray-500 mb-6">Có vẻ như bạn đã truy cập trang này không đúng cách.</p>
        <Link href="/" className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto px-4 py-12 md:py-20 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      
      {/* 1. Card Thành Công */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        
        {/* Header xanh lá cây */}
        <div className="bg-green-600 p-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Đặt hàng thành công!</h1>
          <p className="text-green-100">Cảm ơn bạn đã mua sắm tại SportsShop.</p>
        </div>

        {/* Body thông tin */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-1">Mã đơn hàng của bạn</p>
            <div 
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors group"
              title="Nhấn để sao chép"
            >
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200 tracking-wider">
                {orderCode}
              </span>
              <Copy className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              (Hãy lưu lại mã này để tra cứu đơn hàng sau này)
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-4 items-start">
              <div className="p-2 bg-white dark:bg-blue-800 rounded-full shrink-0">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-200" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Đơn hàng đang chờ xác nhận</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng này trước khi giao.
                  Bạn có thể theo dõi trạng thái đơn hàng trong phần quản lý tài khoản.
                </p>
              </div>
            </div>
          </div>

          {/* Actions Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <Link 
              href={`/tai-khoan/don-hang/${orderCode}`}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-primary hover:text-primary transition-all dark:bg-transparent dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary"
            >
              <Package className="w-5 h-5" />
              Xem chi tiết đơn
            </Link>
            
            <Link 
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-red-700 hover:-translate-y-0.5 transition-all"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>

      {/* Footer support */}
      <p className="text-center text-gray-500 text-sm mt-8">
        Cần hỗ trợ? Gọi ngay <a href="tel:19006868" className="text-primary font-bold hover:underline">1900 6868</a>
      </p>
    </div>
  );
}

// Layout chính
export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}