"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/auth.service";

// Components
import TextField from "@/components/common/input/TextField";
import login_img from "@/assets/images/login.webp";

function AuthHero() {
  return (
    <section className="hidden lg:flex flex-1 relative bg-gray-900 text-white overflow-hidden group">
      <div className="absolute inset-0 z-0">
        <Image
          src={login_img}
          alt="Badminton player"
          fill
          priority
          className="object-cover opacity-80"
          sizes="(min-width: 1024px) 50vw, 0px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col justify-end p-16 w-full max-w-2xl">
        <h2 className="text-5xl font-bold leading-tight mb-4 drop-shadow-sm">
          Lấy lại <br /> <span className="text-primary">Quyền truy cập</span>
        </h2>
        <p className="text-lg text-gray-200/90 font-light">
          Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
        </p>
      </div>
    </section>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Không tìm thấy email này trong hệ thống."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh w-full overflow-hidden">
      {/* Button Home */}
      <Link
        href="/"
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md backdrop-blur hover:bg-white transition"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Về trang chủ
      </Link>

      <AuthHero />

      <section className="flex-1 bg-white dark:bg-background-dark overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">
                Quên mật khẩu?
              </h2>
              <p className="mt-2 text-text-sub">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
              </p>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="rounded-lg bg-green-50 p-6 text-center border border-green-200 animate-in fade-in zoom-in">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span className="material-symbols-outlined text-green-600">
                    check_mail
                  </span>
                </div>
                <h3 className="text-lg font-medium text-green-800">
                  Đã gửi email!
                </h3>
                <p className="mt-2 text-sm text-green-700">
                  Vui lòng kiểm tra hộp thư đến (và mục spam) của{" "}
                  <strong>{email}</strong> để đặt lại mật khẩu.
                </p>
                <div className="mt-6">
                  <Link
                    href="/dang-nhap"
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            ) : (
              /* Form State */
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                    <span className="material-symbols-outlined text-[20px]">
                      error
                    </span>
                    {error}
                  </div>
                )}

                <TextField
                  label="Email đăng ký"
                  placeholder="name@example.com"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-hover hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>

                <div className="text-center mt-4">
                  <Link
                    href="/dang-nhap"
                    className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_back
                    </span>
                    Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
