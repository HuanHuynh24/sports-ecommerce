import Image from "next/image";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { CartItem } from "@/types/checkout";
import { formatCurrency } from "@/lib/utils"; // Hàm format VND (vd: 500.000đ)

interface Props {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  onComplete: () => void;
  isSubmitting: boolean;
}

export default function OrderSummary({ items, subtotal, shippingCost, total, onComplete, isSubmitting }: Props) {
  return (
    <div className="lg:sticky lg:top-24 flex flex-col gap-6">
      <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-6">Đơn hàng ({items.length} sản phẩm)</h2>
        
        {/* Product List */}
        <div className="flex flex-col gap-4 mb-6 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-start group">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                <Image 
                  src={item.image || "https://placehold.co/100"} 
                  alt={item.name} 
                  fill 
                  className="object-cover" 
                />
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-md">
                  x{item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
              </div>
              <p className="text-sm font-bold whitespace-nowrap text-red-600">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Cost Breakdown */}
        <div className="flex flex-col gap-2 mb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Tạm tính</span>
            <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Phí vận chuyển</span>
            <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(shippingCost)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-end border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
          <span className="text-base font-medium">Tổng cộng</span>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 mb-0.5">VND</span>
            <span className="text-2xl font-bold text-red-600 tracking-tight">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Button */}
        <button 
          onClick={onComplete} 
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg shadow-red-600/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 group"
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
          {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
        </button>

        {/* Trust Signals */}
        <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex flex-col items-center gap-1"><Lock className="w-5 h-5" /><span className="text-[10px]">Bảo mật</span></div>
          <div className="flex flex-col items-center gap-1"><ShieldCheck className="w-5 h-5" /><span className="text-[10px]">Chính hãng</span></div>
        </div>
      </div>
    </div>
  );
}