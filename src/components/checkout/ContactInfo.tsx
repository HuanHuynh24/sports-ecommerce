import Link from "next/link";
import { CheckoutFormData } from "@/types/checkout";

interface Props {
  data: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactInfo({ data, onChange }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-bold">Contact Information</h2>
        <span className="text-sm text-gray-500">
          Have an account? <Link href="/login" className="text-red-600 font-medium hover:underline">Log in</Link>
        </span>
      </div>
      <div className="space-y-3">
        <input
          name="email"
          value={data.email}
          onChange={onChange}
          type="email"
          placeholder="Email address"
          className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
        />
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            name="newsletter"
            checked={data.newsletter}
            onChange={onChange}
            id="newsletter" 
            className="rounded border-gray-300 text-red-600 focus:ring-red-600 w-4 h-4" 
          />
          <label htmlFor="newsletter" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
            Email me with news and offers
          </label>
        </div>
      </div>
    </section>
  );
}