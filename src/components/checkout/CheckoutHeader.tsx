import Link from "next/link";
import { Lock } from "lucide-react";

export default function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 lg:px-10 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20 transition-transform group-hover:scale-110">
            {/* Simple Logo Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l20 20"/><path d="M13 13l7-7"/><path d="M4 4l7 7"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            VNB Sports
          </h2>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center text-gray-500 dark:text-gray-400 gap-1.5 text-sm font-medium bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
            <Lock className="w-4 h-4/>
            Secure Checkout
          </div>
          <Link href="/cart" className="text-sm font-medium hover:text-red-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </header>
  );
}