import { CheckoutFormData } from "@/types/checkout";

interface Props {
  data: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function ShippingAddress({ data, onChange }: Props) {
  const inputClass = "w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all";
  
  return (
    <section className="flex flex-col gap-5 pt-2">
      <h2 className="text-lg md:text-xl font-bold">Shipping Address</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="fullName" value={data.fullName} onChange={onChange} type="text" placeholder="Full name" className={inputClass} />
        <input name="phone" value={data.phone} onChange={onChange} type="tel" placeholder="Phone number" className={inputClass} />
      </div>

      <input name="address" value={data.address} onChange={onChange} type="text" placeholder="Address (e.g. 123 Nguyen Trai)" className={inputClass} />

       
    </section>
  );
}