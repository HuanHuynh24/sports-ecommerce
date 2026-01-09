"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import HeaderCart from "./HeaderCart";
import { cn } from "@/lib/utils";

/**
 * Kiểm tra path có active không
 */
function isActivePath(pathname: string, href: string, exact = false) {
  if (href === "#") return false;
  if (exact) return pathname === href;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function HeaderClient({
  initialUsername,
}: {
  initialUsername: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  //State User
  const [username, setUsername] = useState<string | null>(initialUsername);
  
  //State Search
  const [keyword, setKeyword] = useState("");

  //--- 1. LOGIC AUTHENTICATION ---
  useEffect(() => {
    //A. Lấy user từ localStorage (Sync nhanh UI)
    const getUserFromStorage = (): string | null => {
      try {
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("user_info");
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed?.username || parsed?.name || null;
        }
      } catch (e) {
        return null;
      }
      return null;
    };

    //B. Gọi API kiểm tra Session thật
    const verifySession = async () => {
      try {
        const user = await authService.getMe();
        if (user) {
          const displayName = user.username || user.name || "Khách hàng";
          setUsername(displayName);
          
          const storageData = JSON.stringify({ ...user, username: displayName });
          if (localStorage.getItem("user_info") !== storageData) {
             localStorage.setItem("user_info", storageData);
          }
        } else {
           throw new Error("No user returned");
        }
      } catch (error) {
        console.log(error)
        localStorage.removeItem("user_info");
        setUsername(null);
      }
    };

    //C. Hàm điều phối đồng bộ
    const handleSync = (type: 'mount' | 'auth' | 'storage' | 'focus') => {
      const storageUser = getUserFromStorage();
      if (storageUser !== username) {
        setUsername(storageUser);
      }
      if (type === 'mount' || type === 'focus') {
        verifySession();
      }
    };

    //--- SETUP LISTENERS ---
    handleSync('mount');

    const onAuthChanged = () => handleSync('auth');
    const onStorage = () => handleSync('storage');
    const onFocus = () => handleSync('focus');

    window.addEventListener("auth:changed", onAuthChanged);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("auth:changed", onAuthChanged);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [username]);

  //--- 2. LOGIC SEARCH ---
  const handleSearch = () => {
    if (keyword.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  //--- 3. HELPER ---
  const isLoggedIn = Boolean(username);

  const navLinkClass = (href: string) =>
    cn(
      "block py-3.5 transition-colors border-b-4",
      isActivePath(pathname, href, href === "/")
        ? "bg-red-900 border-yellow-400 text-white"
        : "border-transparent hover:bg-red-700 hover:text-yellow-200"
    );

  return (
    <header className="w-full bg-white dark:bg-[#1e0e0e] shadow-lg shadow-gray-100/50 dark:shadow-none sticky top-0 z-50">
      
      {/* Top Bar */}
      <div className="w-full bg-white border-b border-gray-100 dark:bg-[#2a1515] dark:border-[#3d2020]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-1.5 flex justify-between items-center text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-6 text-[#555] dark:text-[#ccc]">
            <a href="tel:19006868" className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
                phone_in_talk
              </span>
              Hotline: <span className="font-bold">1900 6868</span>
            </a>
            <span className="hidden sm:inline w-[1px] h-3 bg-gray-300 dark:bg-[#444]"></span>
            <Link href="/he-thong-cua-hang" className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
                storefront
              </span>
              Hệ thống 58 cửa hàng
            </Link>
          </div>

          <div className="flex items-center gap-4 text-[#555] dark:text-[#ccc]">
            <Link className="hover:text-primary transition-colors hidden sm:block" href="/tra-cuu-don-hang">
              Tra cứu đơn hàng
            </Link>
            <span className="hidden sm:block w-[1px] h-3 bg-gray-300 dark:bg-[#444]"></span>

            {/* === PHẦN HIỂN THỊ USERNAME === */}
            {isLoggedIn ? (
              <Link
                className="hover:text-primary transition-colors font-semibold flex items-center gap-1.5"
                href="/account"
                title="Tài khoản cá nhân"
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                </div>
                <span className="truncate max-w-[150px]">
                  Xin chào, <span className="text-primary font-bold">{username}</span>
                </span>
              </Link>
            ) : (
              <Link
                className="hover:text-primary transition-colors flex items-center gap-1.5"
                href="/dang-nhap"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Đăng nhập
              </Link>
            )}
            {/* === KẾT THÚC === */}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 flex flex-col md:flex-row items-center gap-4 md:gap-8">
        {/* LOGO */}
        <Link className="flex items-center gap-2 group flex-shrink-0" href="/">
          <div className="w-12 h-12 text-primary">
            <svg className="w-full h-full drop-shadow-sm" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter leading-none text-primary uppercase italic">
              SportsShop
            </h1>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#333] dark:text-[#aaa] uppercase pl-0.5">
              Pro Performance
            </span>
          </div>
        </Link>

        {/* SEARCH BAR */}
        <div className="flex-1 w-full max-w-[700px]">
          <div className="flex w-full items-stretch rounded-full border-2 border-gray-100 dark:border-[#3d2020] bg-gray-50 dark:bg-[#2a1515] focus-within:border-primary focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden h-12 shadow-inner">
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 px-6 text-[#1c0d0d] dark:text-white placeholder:text-gray-400 text-sm font-medium"
              placeholder="Tìm vợt cầu lông, giày tennis, phụ kiện..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleSearch}
              className="bg-primary text-white px-6 flex items-center justify-center hover:bg-red-700 transition-colors group"
              aria-label="Tìm kiếm"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                search
              </span>
            </button>
          </div>
        </div>

        {/* CART */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <HeaderCart />
        </div>
      </div>

      {/* Nav Menu (Desktop) */}
      <nav className="w-full bg-primary text-white hidden md:block border-t border-red-800 shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <ul className="flex items-center justify-between gap-1 text-sm font-bold uppercase tracking-wide">
            <li>
              <Link className={cn("px-6", navLinkClass("/"))} href="/">
                Trang chủ
              </Link>
            </li>

            <li className="flex-1 text-center">
              <Link className={navLinkClass("/vot-cau-long")} href="/vot-cau-long">
                Vợt Cầu Lông
              </Link>
            </li>

            <li className="flex-1 text-center">
              <Link className={navLinkClass("/giay-the-thao")} href="/giay-the-thao">
                Giày Thể Thao
              </Link>
            </li>

            <li className="flex-1 text-center">
              <Link className={navLinkClass("/phu-kien")} href="/phu-kien">
                Phụ kiện
              </Link>
            </li>

            <li className="flex-1 text-center">
              <Link className={navLinkClass("/tin-tuc")} href="/tin-tuc">
                Tin tức
              </Link>
            </li>

            <li className="flex-1 text-center">
              <Link className={navLinkClass("/khuyen-mai")} href="/khuyen-mai">
                Khuyến mãi
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}