"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

/* =========================
 * UI helpers
 * ========================= */

function Divider({ text }: { text: string }) {
  return (
    <div className="relative flex py-2 items-center">
      <div className="grow border-t border-gray-200" />
      <span className="shrink-0 mx-4 text-gray-400 text-sm">{text}</span>
      <div className="grow border-t border-gray-200" />
    </div>
  );
}

type FieldProps = {
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
};

function TextField({ label, placeholder, type = "text", name }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-[#1c140d] dark:text-gray-200 text-sm font-medium">
        {label}
      </span>
      <input
        name={name}
        className="w-full rounded-lg border border-[#e8dbce] bg-[#fcfaf8] h-12 px-4 text-base text-[#1c140d]
        placeholder:text-[#9c7349]/70 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none
        dark:bg-[#2a1515] dark:text-white dark:border-[#3d2020]"
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

type PasswordFieldProps = {
  label: string;
  placeholder?: string;
  name?: string;
};

function PasswordField({ label, placeholder, name }: PasswordFieldProps) {
  const [show, setShow] = React.useState(false);

  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-[#1c140d] dark:text-gray-200 text-sm font-medium">
        {label}
      </span>

      <div className="relative">
        <input
          name={name}
          className="w-full rounded-lg border border-[#e8dbce] bg-[#fcfaf8] h-12 pl-4 pr-12 text-base text-[#1c140d]
          placeholder:text-[#9c7349]/70 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none
          dark:bg-[#2a1515] dark:text-white dark:border-[#3d2020]"
          placeholder={placeholder}
          type={show ? "text" : "password"}
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9c7349] hover:text-[#1c140d] dark:hover:text-white focus:outline-none p-1 rounded-md"
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          <span className="material-symbols-outlined text-[20px] block">
            {show ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>

      {/* strength bar (UI only) */}
      <div className="flex gap-1 h-1 mt-1">
        <div className="flex-1 bg-gray-200 rounded-full" />
        <div className="flex-1 bg-gray-200 rounded-full" />
        <div className="flex-1 bg-gray-200 rounded-full" />
        <div className="flex-1 bg-gray-200 rounded-full" />
      </div>
    </label>
  );
}

function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        className="flex items-center justify-center gap-2 h-11 border border-[#e8dbce] rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all bg-white
        dark:bg-[#2a1515] dark:hover:bg-[#321b1b] dark:border-[#3d2020]"
      >
        {/* Google */}
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span className="text-[#1c140d] dark:text-white text-sm font-medium">
          Google
        </span>
      </button>

      <button
        type="button"
        className="flex items-center justify-center gap-2 h-11 border border-[#e8dbce] rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all bg-white
        dark:bg-[#2a1515] dark:hover:bg-[#321b1b] dark:border-[#3d2020]"
      >
        {/* Facebook */}
        <svg
          className="w-5 h-5 text-[#1877F2]"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="text-[#1c140d] dark:text-white text-sm font-medium">
          Facebook
        </span>
      </button>
    </div>
  );
}

function HeroPanel() {
  const bgUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAf2ceNx81paIT6GVeXYh_6P4oeMZZL0RQxIC5aTeNoUoCMILCBae0_oBximrh-We2GzsCL0mR95caWpy5Ol2YKxg7F_rR5SXFY26vq3LRIcIWATfiXOnMLneWVgaSva6D5D0u_S3F0fYAXUXal9YVVQepwhuzDw5oDKTq0UTys8-ChdUYaSnVFuvUckHz27-lXN61O_hNAzUeIjSMPpA9vEyXkL4JRjmEEnTFwsMn2k_3xRXrPwK2xGxoHxZJ7F2xV9Ejjfi5A_g";

  return (
    <section
      className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-12 xl:p-20 bg-cover bg-center group"
      style={{ backgroundImage: `url("${bgUrl}")` }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10 flex flex-col gap-4 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/90 text-white w-fit text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px]">
            verified
          </span>
          <span>Chính hãng 100%</span>
        </div>

        <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
          Đam mê cầu lông <br />
          <span className="text-primary">Chinh phục đỉnh cao</span>
        </h1>

        <p className="text-gray-200 text-lg font-medium leading-relaxed max-w-md">
          Tham gia cộng đồng VNB Sports ngay hôm nay để nhận ưu đãi độc quyền và
          cập nhật những xu hướng mới nhất.
        </p>

        <div className="flex gap-4 mt-4">
          <div className="flex -space-x-3">
            <Image
              width={10}
              height={10}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmDdQcaLx340k7BBLG5RNougo-_njFbcylJN-8CuT28_puCKbqdI5JtRcSz-rAegvVAXBNnufdKNUgcZywdarBjSMOEoHtNl8xDUvN_JW4ArSDwhEcPH62mkUVHXWj3PGMbd2tfp1NwywNxTn1J4Xw4Gw5ASmhHxgZDd40qq1GEx2OH7oE68JUE3y1pnLBWM9rRGKNkLbbNdzP0hGMGw6pdbWOBMUJ1URBoe6BJ5hX1lUwyvUeud1v7Kb8-xfOxxQ3uj7u0dK8cw"
            />
            <Image
              width={10}
              height={10}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe-tVIZ59YvRwRc-DCCB7lt5Q3n9HKzMogEDG38SBfnaY4FxiLb0Nv4D7ukY6tcM7Jq_zo6GR4CeA2YXOwrvIC0RnMlhkBeIuMCG2R5dRy_4THaNTJuH6wNao3EmK2V6VaZyP1sCKfb6thf0qUBfaDLfUC5rKlPlMJDBWKUsFDubDUkiCmxivQjsPoWgU8yR-xIDm7TanRnOCkSOrd00cThQtGnDegeGw2azVabyJPe7Kpa_835-bLSyReaYrYGOjb_U9YSw-_9A"
            />
            <Image
              width={10}
              height={10}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh2zwC-vtvlhFaUN879RMfQL5WXAXwH1hftMMT6YthPN1M5vLwkeuEBzo31aKszpeAjbSzATCQDNt6LG1wknwVFHdPnTL74aDMZc31bKoDrLE6_4SZI8I1vCD4_2qcHQLUYA9uf-aoQd4aa0eXNsl-7-ynh0SViir-ZWoEb8WY3BE1aCz4bUjfA04Yxk7Dcwe1yHO9o_CN8qiE7lwTgX_HgzeaYQqieeT67Ixe4Fu_h6wgyBhuyvEhDnOJDY6_Qw0oL0O-bFrWOw"
            />
            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-xs text-white font-medium">
              +2k
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex text-yellow-400 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[14px] fill-current"
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-gray-300 text-xs">Thành viên tin dùng</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
 * Page
 * ========================= */

export default function RegisterPage() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API register
  };

  return (
    <main className="relative flex min-h-dvh w-full overflow-hidden bg-white dark:bg-[#1c140d]">
      <Link
        href="/"
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800
        shadow-md ring-1 ring-black/5 backdrop-blur hover:bg-white transition
        dark:bg-[#2a1515]/90 dark:text-gray-100 dark:ring-white/10"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Về trang chủ
      </Link>

      <HeroPanel />

      {/* Right panel: không scroll, canh giữa */}
      <section className="flex lg:w-1/2 w-full">
        <div className="w-full flex items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full  flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1c140d] dark:text-white text-3xl font-bold leading-tight">
                Đăng ký tài khoản
              </h2>
              <p className="text-[#9c7349] dark:text-gray-400 text-sm font-normal">
                Đã có tài khoản?{" "}
                <Link
                  className="text-primary font-semibold hover:underline"
                  href="/dang-nhap"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            <form className="flex flex-col gap-5 w-full" onSubmit={onSubmit}>
              <TextField
                label="Họ và tên"
                placeholder="Ví dụ: Nguyễn Văn A"
                name="fullName"
              />

              <TextField
                label="Email hoặc Số điện thoại"
                placeholder="09xx... hoặc email@example.com"
                name="identity"
              />

              <PasswordField
                label="Mật khẩu"
                placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
                name="password"
              />

              <PasswordField
                label="Nhập lại mật khẩu"
                placeholder="Xác nhận lại mật khẩu"
                name="confirmPassword"
              />

              <div className="flex items-start gap-3 mt-1">
                <div className="flex items-center h-5">
                  <input
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    id="terms"
                    type="checkbox"
                    name="terms"
                  />
                </div>
                <label
                  className="text-sm text-gray-600 dark:text-gray-400 select-none"
                  htmlFor="terms"
                >
                  Tôi đồng ý với{" "}
                  <Link
                    className="text-primary hover:underline font-medium"
                    href="#"
                  >
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    className="text-primary hover:underline font-medium"
                    href="#"
                  >
                    Chính sách bảo mật
                  </Link>{" "}
                  của VNB Sports.
                </label>
              </div>

              <button
                className="w-full flex items-center justify-center rounded-lg h-12 bg-primary hover:bg-orange-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-md transition-all active:scale-[0.98] mt-2 group"
                type="submit"
              >
                <span>Đăng ký</span>
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform text-[20px]">
                  arrow_forward
                </span>
              </button>
            </form>

            <Divider text="Hoặc đăng ký bằng" />
            <SocialButtons />

            <div className="mt-2 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 gap-2">
              <span className="material-symbols-outlined text-[16px] text-green-600">
                security
              </span>
              <span>Thông tin của bạn được bảo mật tuyệt đối</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
