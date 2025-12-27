"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import GoogleIcon from "@/assets/icon/GoogleIcon";
import FacebookIcon from "@/assets/icon/FacebookIcon";
import SocialButton from "@/components/SocialButton";
import login_img from "@/assets/images/login.webp";

/* =========================================
 * Small UI helpers
 * ========================================= */

type TextInputProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  leftIcon?: string;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
};

function TextInput({
  id,
  name,
  label,
  placeholder,
  type = "text",
  leftIcon,
  rightSlot,
  autoComplete,
}: TextInputProps) {
  return (
    <div>
      <label
        className="block text-sm font-medium text-text-main dark:text-gray-200 mb-2"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="relative rounded-lg shadow-sm">
        {leftIcon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-gray-400 text-[20px]">
              {leftIcon}
            </span>
          </div>
        ) : null}

        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[
            "block w-full rounded-lg border-border-color py-3 text-text-main placeholder:text-gray-400",
            "focus:border-primary focus:ring-primary sm:text-sm",
            "bg-background-light dark:bg-[#2a221b] dark:border-gray-700 dark:text-white",
            "transition-all duration-200",
            leftIcon ? "pl-10" : "pl-4",
            rightSlot ? "pr-10" : "pr-4",
          ].join(" ")}
        />

        {rightSlot ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Divider({ text }: { text: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white dark:bg-background-dark px-2 text-gray-500">
          {text}
        </span>
      </div>
    </div>
  );
}

/* =========================================
 * Left hero panel (desktop)
 * ========================================= */

function LoginHero() {
  return (
    <section className="hidden lg:flex flex-1 relative bg-gray-900 text-white overflow-hidden group">
      <div className="absolute inset-0 z-0">
        {/* fill để luôn phủ full cột, không phụ thuộc width/height */}
        <Image
          src={login_img}
          alt="Badminton player ready to smash"
          fill
          priority
          className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(min-width: 1024px) 50vw, 0px"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col justify-end p-16 w-full max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-md w-fit">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span>Hàng chính hãng 100%</span>
        </div>

        <h2 className="text-5xl font-bold leading-tight mb-4 drop-shadow-sm">
          Đam mê cầu lông <br />
          <span className="text-primary">Nâng tầm đẳng cấp</span>
        </h2>

        <p className="text-lg text-gray-200/90 font-light max-w-md">
          Vợt chuẩn - Giày êm - Chiến thắng trong tầm tay. Khám phá bộ sưu tập
          mới nhất ngay hôm nay.
        </p>

        <div className="flex gap-4 mt-8">
          <div className="flex -space-x-3">
            {/* Ảnh avatar remote: dùng img để khỏi config next/image */}
            <img
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlKTR64ryAPGq7Ni_L53m15zy2iLOrlohfxCQSFt5fykD5gE8PYPLYVgvB4_atRSaPyWIoMarAyG6MV6znkGsf_jh0BWR_4t-P-bifWfwqQz4UeOyV-77sVvXvp1HXeB5fUP0Lem0Xbe2Ims7M4ApDvuNtoI2vlC1xV8gBUQvSMtkDat4x8NMQPCPPxxNpXzFy9gaE3xXtFmTLYA9GZvLKQ26YoVA9OplaLPpscdp1CTvnQgt5cwRjA3DJFHiPPhTXJcTbfO183w"
            />
            <img
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYoTMvbMsg9W2Z-cSyq-8d-L0AMGOAk_iRO7hQeOd_hiJqq3rkbB03s2k5q1ba2u7LVMDIOl_8I7QD9j2vBQTIackr7ZhU7nyyopOZ9ZIgzm5bm5cLHw7sMVRFLPBD8gGHdMJa-WyTriN7tsEo7i86pqIihr4Swvy-yI659rZfpDf2WlXLLjPF96CBI0vI2WVW8TJm-7VU4aZpw1k_aGE2ASfkSBEcOZrjOXitPL5zzGaBCsiS9lSZucpg2kjHzpHlaPYUAwFGOA"
            />
            <img
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGpTgae8M-SN8FKitHcPz-L9ajtPumEKfV7UadCqSTDeH4HyRxy7l3qQJTA51VCNBkrcWuIUyQp03wqk3kDjI9pqFbhCDUY374aRjpbnWGcwFCVX0CPAzEWu9XxvNTt0jUb4OK61hiRSzhruvOAesimkI6_tTb5kZxmHHsXxfaaupmox4AMhgpxA8yZvyi4P9ltllal1CYssU7Mo2KF6ZnNzVKv_TZ1rW85Y2R2fSmB0M3PeHVFsPDXO78gog1AAi78WzDt36Yfw"
            />
            <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-xs font-bold text-white">
              +2k
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex text-yellow-400 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[16px] fill-current"
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-300">
              Được tin dùng bởi cộng đồng vợt thủ
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================
 * Right form panel
 * ========================================= */

function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const identity = String(form.get("identity") || "").trim();
    const password = String(form.get("password") || "");
    console.log({ identity, password });
  };

  const onGoogle = () => console.log("Login with Google");
  const onFacebook = () => console.log("Login with Facebook");

  return (
    <section className="flex-1 bg-white dark:bg-background-dark">
      {/* wrapper 100vh, không scroll */}
      <div className="h-dvh flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">
              Đăng nhập
            </h2>
            <p className="mt-2 text-text-sub">
              Chào mừng bạn quay trở lại với Sports shop!
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <TextInput
              id="identity"
              name="identity"
              label="Email hoặc Số điện thoại"
              placeholder="VD: 0912345678 hoặc email@example.com"
              leftIcon="mail"
              autoComplete="username"
            />

            <TextInput
              id="password"
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              type={showPassword ? "text" : "password"}
              leftIcon="lock"
              autoComplete="current-password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="hover:text-primary transition-colors text-gray-400"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-main dark:text-gray-300">
                <input
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                Ghi nhớ đăng nhập
              </label>

              <Link
                className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                href="/forgot-password"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-hover
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200
              shadow-sm hover:shadow-[0_6px_20px_rgba(244,140,37,0.23)]
              hover:-translate-y-0.5 active:translate-y-0"
              type="submit"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-white/60 group-hover:text-white transition-colors text-[20px]">
                  login
                </span>
              </span>
              Đăng nhập
            </button>
          </form>

          <Divider text="Hoặc tiếp tục với" />

          <div className="grid grid-cols-2 gap-3">
            <SocialButton label="Google" icon={<GoogleIcon />} onClick={onGoogle} />
            <SocialButton
              label="Facebook"
              icon={<FacebookIcon />}
              onClick={onFacebook}
            />
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Chưa có tài khoản?{" "}
            <Link
              className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors"
              href="/register"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-100dvh">
      <Link
        href="/"
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 transition hover:text-primary"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Về trang chủ
      </Link>

      <LoginHero />
      <LoginForm />
    </main>
  );
}
