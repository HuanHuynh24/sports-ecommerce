"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

//Utils
import { isValidEmail, isValidPhone } from "@/lib/utils";

//Types & Services
import { CheckoutFormData, PaymentType } from "@/types/checkout";
import { useCartStore } from "@/hooks/useCart";
import { orderService } from "@/services/order.service";
import { authService } from "@/services/auth.service"; // 1. Import authService

//Components
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import ContactInfo from "@/components/checkout/ContactInfo";
import ShippingAddress from "@/components/checkout/ShippingAddress";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const router = useRouter();

  //Store & State
  const { items, fetchCart, cartCount } = useCartStore();
  const selectedItems = items.filter((item) => item.is_selected);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    newsletter: false,
    fullName: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LẤY DỮ LIỆU GIỎ HÀNG ---
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // --- 2. LẤY THÔNG TIN USER ĐỂ AUTO-FILL ---
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await authService.getMe();
        
        if (user) {
          // Cập nhật state formData với thông tin từ user
          setFormData((prev) => ({
            ...prev,
            email: user.email || "",
            // Map từ user.name sang fullName
            fullName: user.name || "",
            // Xử lý trường hợp phone null
            phone: user.phone || "", 
          }));
        }
      } catch (error) {
        // Nếu lỗi (vd: chưa đăng nhập) thì lờ đi, để user tự nhập
        console.log("User not logged in or fetch error", error);
      }
    };

    fetchUserInfo();
  }, []); // Chạy 1 lần khi mount

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    //@ts-ignore
    const val = type === "checkbox" ? e.target.checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  //--- LOGIC VALIDATE VÀ GỌI API (GIỮ NGUYÊN) ---
  const handleCompletePurchase = async () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán.");
      return;
    }
    if (
      !formData.fullName.trim() ||
      !formData.address.trim() ||
      !formData.province ||
      !formData.district ||
      !formData.ward
    ) {
      toast.error("Vui lòng điền đầy đủ tên và địa chỉ giao hàng.");
      return;
    }
    if (formData.email && !isValidEmail(formData.email)) {
      toast.error("Email không đúng định dạng.");
      return;
    }
    if (!formData.phone.trim() || !isValidPhone(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ (VN).");
      return;
    }

    //--- BẮT ĐẦU GỌI API ---
    setIsSubmitting(true);
    const toastId = toast.loading("Đang xử lý đơn hàng...");

    try {
      const fullAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`;

      const payload = {
        receiver_name: formData.fullName,
        receiver_phone: formData.phone,
        shipping_address: fullAddress,
        payment_method: paymentMethod,
        note: formData.note || "",
      };

      const res = await orderService.createOrder(payload);

      if (res.status) {
        await fetchCart();
        const orderCode = res.data?.code;

        if (paymentMethod === "vnpay") {
          toast.loading("Đang chuyển hướng sang VNPAY...", { id: toastId });
          try {
            const vnpayRes = await orderService.createVnpayUrl(orderCode);
            if (vnpayRes.status && vnpayRes.data?.url) {
              window.location.href = vnpayRes.data.url;
            } else {
              toast.error(
                "Lỗi tạo cổng thanh toán. Vui lòng thử lại sau.",
                { id: toastId }
              );
              router.push(
                `/order-success?code=${orderCode}&payment_failed=true`
              );
            }
          } catch (vnpayError) {
            console.error("VNPAY Error:", vnpayError);
            toast.error("Lỗi kết nối VNPAY.", { id: toastId });
            router.push(`/order-success?code=${orderCode}&payment_failed=true`);
          }
        }
        else {
          toast.success("Đặt hàng thành công!", { id: toastId });
          router.push(`/order-success?code=${orderCode}`);
        }
      } else {
        toast.error(res.message || "Đặt hàng thất bại.", { id: toastId });
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Lỗi hệ thống.", { id: toastId });
    } finally {
      if (paymentMethod !== "vnpay") {
        setIsSubmitting(false);
      }
    }
  };

  //Tính toán hiển thị
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = 30000;
  const total = subtotal + shippingCost;

  if (cartCount === 0 && !isSubmitting) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-500">Giỏ hàng của bạn đang trống.</p>
        <Link
          href="/"
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans pb-10">
      <main className="w-full max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <nav className="flex flex-wrap gap-2 items-center text-sm">
              <Link
                href="/cart"
                className="text-red-600 font-medium hover:underline"
              >
                Giỏ hàng
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="font-bold">Thanh toán</span>
            </nav>

            {/* Component này sẽ hiển thị dữ liệu đã được fill từ state formData */}
            <ContactInfo data={formData} onChange={handleInputChange} />
            <ShippingAddress data={formData} onChange={handleInputChange} />

            {/* Thông báo Shipping */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-200">
                {/* SVG Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 17h4V5H2v12h3m10 0h4v-3.343c0-.53-.211-1.039-.586-1.414l-2.828-2.828a2 2 0 0 0-1.414-.586h-2.172v5h3" />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                  Phí vận chuyển đồng giá
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Áp dụng cho mọi đơn hàng trên toàn quốc.
                </p>
              </div>
              <span className="ml-auto font-bold text-blue-800 dark:text-blue-200">
                30.000₫
              </span>
            </div>

            <PaymentMethod
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Ghi chú (Tùy chọn)</label>
              <textarea
                name="note"
                rows={2}
                className="w-full p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="Lời nhắn cho người bán hoặc shipper..."
                onChange={handleInputChange}
                value={formData.note} // Đảm bảo binding value
              />
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="lg:col-span-5">
            <OrderSummary
              items={selectedItems}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              onComplete={handleCompletePurchase}
              tax={0}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            <div className="text-center">
              <p className="font-bold text-lg">Đang tạo đơn hàng...</p>
              <p className="text-sm text-gray-500">
                Vui lòng không tắt trình duyệt.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}