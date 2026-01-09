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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Province */}
        <div className="relative">
          <select name="province" value={data.province} onChange={onChange} className={`${inputClass} appearance-none cursor-pointer`}>
            <option value="" disabled>Province /City</option>
            <option value="hcm">Ho Chi Minh City</option>
            <option value="hn">Ha Noi</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
        </div>
        {/* District */}
        <div className="relative">
          <select name="district" value={data.district} onChange={onChange} className={`${inputClass} appearance-none cursor-pointer`}>
            <option value="" disabled>District</option>
            <option value="d1">District 1</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
        </div>
        {/* Ward */}
        <div className="relative">
          <select name="ward" value={data.ward} onChange={onChange} className={`${inputClass} appearance-none cursor-pointer`}>
            <option value="" disabled>Ward</option>
            <option value="w1">Ward 1</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
        </div>
      </div>
    </section>
  );
}