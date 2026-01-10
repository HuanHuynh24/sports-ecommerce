import { Banknote, Landmark, CreditCard, Wallet, QrCode } from "lucide-react";
import { PaymentType } from "@/types/checkout";

// Định nghĩa danh sách các phương thức Banking/Ví điện tử
const bankingOptions = [
  { id: "momo", label: "Momo Wallet", icon: Wallet },
  { id: "vnpay", label: "VNPay QR", icon: QrCode },
  // Bạn có thể thêm ZaloPay hoặc AppotaPay ở đây
];

interface Props {
  selected: PaymentType;
  onSelect: (value: PaymentType) => void;
}

export default function PaymentMethod({ selected, onSelect }: Props) {
  // Helper để kiểm tra xem giá trị đang chọn có thuộc nhóm Banking không
  const isBankingSelected = (current: string) => {
    return current === "banking" || bankingOptions.some((opt) => opt.id === current);
  };

  return (
    <section className="flex flex-col gap-5 pt-2">
      <h2 className="text-lg md:text-xl font-bold">Payment Method</h2>
      <div className="flex flex-col rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-white/5">
        
        {/* --- Option 1: Cash on Delivery (COD) --- */}
        <label className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={selected === "cod"}
            onChange={() => onSelect("cod")}
            className="w-4 h-4 text-red-600 focus:ring-red-600 border-gray-300"
          />
          <div className="flex-1 flex items-center justify-between">
            <span className="font-medium">Cash on Delivery (COD)</span>
            <Banknote className="w-5 h-5 text-gray-500" />
          </div>
        </label>

        {/* --- Option 2: Banking (Parent) --- */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <label className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${isBankingSelected(selected) ? 'bg-gray-50 dark:bg-white/5' : ''}`}>
            <input
              type="radio"
              name="payment"
              value="banking"
              // Checked nếu đang chọn 'banking' HOẶC bất kỳ option con nào (momo, vnpay...)
              checked={isBankingSelected(selected)}
              onChange={() => {
                // Khi click vào cha, mặc định chọn cái đầu tiên (ví dụ momo)
                onSelect(bankingOptions[0].id as PaymentType);
              }}
              className="w-4 h-4 text-red-600 focus:ring-red-600 border-gray-300"
            />
            <div className="flex-1 flex items-center justify-between">
              <span className="font-medium">Bank Transfer (QR Code)</span>
              <Landmark className="w-5 h-5 text-gray-500" />
            </div>
          </label>

          {/* Sub-options for Banking (Chỉ hiện khi Banking được chọn) */}
          {isBankingSelected(selected) && (
            <div className="flex flex-col bg-gray-50 dark:bg-black/20 animate-in fade-in slide-in-from-top-2 duration-200">
              {bankingOptions.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-4 p-3 pl-12 border-t border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <input
                    type="radio"
                    name="banking_provider"
                    value={item.id}
                    checked={selected === item.id}
                    onChange={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện nổi bọt lên cha
                        onSelect(item.id as PaymentType);
                    }}
                    className="w-4 h-4 text-red-600 focus:ring-red-600 border-gray-300"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                    <item.icon className="w-4 h-4 text-gray-500" />
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* --- Option 3: Credit Card --- */}
        <label className="flex items-center gap-4 p-4 border-b last:border-0 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={selected === "card"}
            onChange={() => onSelect("card")}
            className="w-4 h-4 text-red-600 focus:ring-red-600 border-gray-300"
          />
          <div className="flex-1 flex items-center justify-between">
            <span className="font-medium">Credit Card</span>
            <CreditCard className="w-5 h-5 text-gray-500" />
          </div>
        </label>

      </div>
    </section>
  );
}