"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/auth.service";

// Components
import PasswordField from "@/components/common/input/PasswordField";
import login_img from "@/assets/images/login.webp";

function AuthHero() {
  return (
    <section className="hidden lg:flex flex-1 relative bg-gray-900 text-white overflow-hidden group">
      <div className="absolute inset-0 z-0">
        <Image
          src={login_img}
          alt="Badminton"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col justify-end p-16 w-full max-w-2xl">
        <h2 className="text-5xl font-bold leading-tight mb-4 drop-shadow-sm">
          Bảo mật <br /> <span className="text-primary">Tối đa</span>
        </h2>
        <p className="text-lg text-gray-200/90 font-light">
          Đặt lại mật khẩu mới để tiếp tục mua sắm an toàn.
        </p>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy token và email từ URL
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !emailParam) {
      setError("Liên kết không hợp lệ hoặc đã hết hạn.");
    }
  }, [token, emailParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token: token || "",
        email: emailParam || "",
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      setIsSuccess(true);
      // Chuyển hướng sau 3 giây
      setTimeout(() => router.push("/dang-nhap"), 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Đặt lại mật khẩu thất bại. Token có thể đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh w-full overflow-hidden">
      <AuthHero />

      <section className="flex-1 bg-white dark:bg-background-dark overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">
                Đặt lại mật khẩu
              </h2>
              <p className="mt-2 text-text-sub">
                Tạo mật khẩu mới cho tài khoản: <strong>{emailParam}</strong>
              </p>
            </div>

            {isSuccess ? (
              <div className="rounded-lg bg-green-50 p-6 text-center border border-green-200">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span className="material-symbols-outlined text-green-600">
                    check_circle
                  </span>
                </div>
                <h3 className="text-lg font-bold text-green-800">
                  Thành công!
                </h3>
                <p className="mt-2 text-sm text-green-700">
                  Mật khẩu của bạn đã được cập nhật. Đang chuyển về trang đăng
                  nhập...
                </p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                    <span className="material-symbols-outlined text-[20px]">
                      error
                    </span>
                    {error}
                  </div>
                )}

                <PasswordField
                  label="Mật khẩu mới"
                  name="password"
                  placeholder="Nhập mật khẩu mới"
                  value={formData.password}
                  onChange={handleChange}
                />

                <PasswordField
                  label="Xác nhận mật khẩu"
                  name="password_confirmation"
                  placeholder="Nhập lại mật khẩu mới"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="group flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-hover hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
