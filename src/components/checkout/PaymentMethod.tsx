import { Banknote, Landmark, CreditCard } from "lucide-react";
import { PaymentType } from "@/types/checkout";

interface Props {
  selected: PaymentType;
  onSelect: (value: PaymentType) => void;
}

export default function PaymentMethod({ selected, onSelect }: Props) {
  return (
    <section className="flex flex-col gap-5 pt-2">
      <h2 className="text-lg md:text-xl font-bold">Payment Method</h2>
      <div className="flex flex-col rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-white/5">
        {[
          { id: "cod", label: "Cash on Delivery (COD)", icon: Banknote },
          { id: "banking", label: "Bank Transfer (QR Code)", icon: Landmark },
          { id: "card", label: "Credit Card", icon: CreditCard },
        ].map((item) => (
          <label key={item.id} className="flex items-center gap-4 p-4 border-b last:border-0 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <input 
              type="radio" name="payment" value={item.id}
              checked={selected === item.id}
              onChange={() => onSelect(item.id as PaymentType)}
              className="w-4 h-4 text-red-600 focus:ring-red-600 border-gray-300"
            />
            <div className="flex-1 flex items-center justify-between">
              <span className="font-medium">{item.label}</span>
              <item.icon className="w-5 h-5 text-gray-500" />
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}