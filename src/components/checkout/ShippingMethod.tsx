import { Truck, Rocket, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShippingType } from "@/types/checkout";

interface Props {
  selected: ShippingType;
  onSelect: (value: ShippingType) => void;
}

export default function ShippingMethod({ selected, onSelect }: Props) {
  const methods = [
    { id: "standard", label: "Standard Delivery", time: "3-5 Business Days", price: 0, icon: Truck },
    { id: "express", label: "Express Delivery", time: "1-2 Business Days", price: 5, icon: Rocket },
  ];

  return (
    <section className="flex flex-col gap-5 pt-2">
      <h2 className="text-lg md:text-xl font-bold">Shipping Method</h2>
      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <label 
            key={method.id}
            className={cn(
              "group relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-all",
              selected === method.id
                ? "border-red-600 bg-red-50/50 dark:bg-red-900/10 ring-1 ring-red-600" 
                : "border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 hover:border-red-400"
            )}
          >
            <input 
              type="radio" 
              name="shipping" 
              value={method.id} 
              className="sr-only"
              checked={selected === method.id}
              onChange={() => onSelect(method.id as ShippingType)}
            />
            <div className="flex flex-1 items-center gap-3">
              <div className={cn("p-2 rounded-full", selected === method.id ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500")}>
                  <method.icon className="w-5 h-5" />
              </div>
              <div>
                  <span className="block text-sm font-bold">{method.label}</span>
                  <span className="text-sm text-gray-500">{method.time}</span>
              </div>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              {method.price === 0 ? "Free" : `$${method.price.toFixed(2)}`}
            </span>
            {selected === method.id && (
              <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-red-600" />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}