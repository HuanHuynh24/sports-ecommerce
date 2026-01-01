"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Imports Services & Utils ---
import { authService } from "@/services/auth.service";
import { loginSuccess } from "@/utils/auth";
import {
  validateRegisterForm,
  calculatePasswordStrength,
} from "@/utils/validation";

// --- Imports UI Components ---
import HeroPanel from "@/components/page/dang-ky/HeroPanel";
import TextField from "@/components/common/input/TextField";
import PasswordField from "@/components/common/input/PasswordField";
import SocialButtons from "@/components/page/dang-ky/SocialButtons";

/* =========================
 * Sub-Components (Internal)
 * ========================= */

// 1. Divider Component
function Divider({ text }: { text: string }) {
  return (
    <div className="relative flex py-2 items-center">
      <div className="grow border-t border-gray-200 dark:border-gray-700" />
      <span className="shrink-0 mx-4 text-gray-400 text-sm">{text}</span>
      <div className="grow border-t border-gray-200 dark:border-gray-700" />
    </div>
  );
}

// 2. Loading/Success Overlay Component
const LoadingRedirect = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 dark:bg-[#1c140d]/95 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center mb-6">
        <div className="h-24 w-24 animate-spin rounded-full border-[5px] border-gray-200 border-t-primary dark:border-gray-700 dark:border-t-primary"></div>
        <span className="material-symbols-outlined absolute text-4xl text-primary font-bold animate-pulse">
          check
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white animate-bounce">
        Đăng ký thành công!
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Đang chuyển hướng về trang chủ...
      </p>
    </div>
  );
};

/* =========================
 * Main Page Component
 * ========================= */

export default function RegisterPage() {
  const router = useRouter();

  // --- States ---
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Trạng thái thành công để hiện Overlay
  const [formData, setFormData] = useState({
    name: "",
    identity: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [passStrength, setPassStrength] = useState(0);

  // --- Handlers ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Xóa lỗi của field đang nhập
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Tính điểm password realtime
    if (name === "password") {
      setPassStrength(calculatePasswordStrength(value));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    // 1. Validate Form (Tách biệt logic)
    const { isValid, errors } = validateRegisterForm(formData);

    if (!isValid) {
      setFieldErrors(errors as any);
      return;
    }

    // 2. Gọi API
    setLoading(true);

    try {
      const res = await authService.register({
        email: formData.identity,
        password: formData.password,
        name: formData.name,
        password_confirmation: formData.password,
      });

      // 3. Xử lý thành công
      // Lưu thông tin user vào localStorage & dispatch event cập nhật Header
      loginSuccess(res.data.user);

      // Bật màn hình Loading Overlay
      setIsSuccess(true);

      // Đợi 1.5s cho user đọc thông báo rồi chuyển trang
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      // Xử lý lỗi từ API
      const msg =
        err?.response?.data?.message ||
        "Đăng ký thất bại, vui lòng kiểm tra lại thông tin.";
      setGeneralError(msg);
      console.error("Lỗi đăng ký:", err);

      // Chỉ tắt loading nếu lỗi (nếu thành công thì giữ loading để hiện Overlay)
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh w-full overflow-hidden bg-white dark:bg-[#1c140d]">
      {isSuccess && <LoadingRedirect />}

      <Link
        href="/"
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md ring-1 ring-black/5 backdrop-blur hover:bg-gray-50 transition dark:bg-[#2a1515]/90 dark:text-gray-100 dark:ring-white/10"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Về trang chủ
      </Link>

      <HeroPanel />

      <section className="flex lg:w-1/2 w-full overflow-y-auto">
        <div className="w-full flex items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-md flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1c140d] dark:text-white text-3xl font-bold leading-tight">
                Đăng ký tài khoản
              </h2>
              <p className="text-[#9c7349] dark:text-gray-400 text-sm font-normal">
                Đã có tài khoản?{" "}
                <Link
                  className="text-primary font-semibold hover:underline transition-colors"
                  href="/dang-nhap"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            {generalError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-red-600">
                  error
                </span>
                <span className="text-red-600 text-sm font-medium pt-0.5">
                  {generalError}
                </span>
              </div>
            )}

            <form
              className="flex flex-col gap-5 w-full"
              onSubmit={onSubmit}
              noValidate
            >
              <TextField
                label="Họ và tên"
                placeholder="Ví dụ: Nguyễn Văn A"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={fieldErrors.name}
              />

              <TextField
                label="Email hoặc Số điện thoại"
                placeholder="09xx... hoặc email@example.com"
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                error={fieldErrors.identity}
              />

              <PasswordField
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
                strength={passStrength}
                showStrengthBar={true}
              />

              <PasswordField
                label="Nhập lại mật khẩu"
                placeholder="Xác nhận lại mật khẩu"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={fieldErrors.confirmPassword}
              />

              <button
                className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-primary hover:bg-orange-600 text-white text-base font-bold shadow-md transition-all active:scale-[0.98] mt-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng ký</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">
                      arrow_forward
                    </span>
                  </>
                )}
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
