"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

//--- Services & Utils ---
import { authService } from "@/services/auth.service";
import { loginSuccess } from "@/utils/auth"; //Hàm lưu localStorage bạn đã có
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api/v1";

//--- Icons & Assets ---
import GoogleIcon from "@/assets/icon/GoogleIcon";
import FacebookIcon from "@/assets/icon/FacebookIcon";
import login_img from "@/assets/images/login.webp";

//--- Components ---
import SocialButton from "@/components/SocialButton";
import TextField from "@/components/common/input/TextField";
import PasswordField from "@/components/common/input/PasswordField";

/* =========================================
 * Sub-Components (UI thuần túy)
 * ========================================= */

//1. Divider
function Divider({ text }: { text: string }) {
  return (
    <div className="relative py-2">
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

//2. Loading Overlay (Tái sử dụng từ trang Register để đồng bộ)
const LoadingRedirect = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 dark:bg-[#1c140d]/95 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="relative flex items-center justify-center mb-6">
      <div className="h-20 w-20 animate-spin rounded-full border-[4px] border-gray-200 border-t-primary"></div>
      <span className="material-symbols-outlined absolute text-3xl text-primary font-bold animate-pulse">
        lock_open
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-800 dark:text-white animate-bounce">
      Đăng nhập thành công!
    </h3>
    <p className="mt-2 text-gray-500 dark:text-gray-400">
      Đang đưa bạn về trang chủ...
    </p>
  </div>
);

//3. Hero Panel
function LoginHero() {
  return (
    <section className="hidden lg:flex flex-1 relative bg-gray-900 text-white overflow-hidden group">
      <div className="absolute inset-0 z-0">
        <Image
          src={login_img}
          alt="Badminton player"
          fill
          priority
          className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(min-width: 1024px) 50vw, 0px"
        />
        {/* Fix gradient syntax: bg-gradient-to-t */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
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

        {/* Social Proof */}
        <div className="flex gap-4 mt-8">
          <div className="flex -space-x-3">
            {[0, 1, 2].map((i) => (
              <img
                key={i}
                alt={`User ${i}`}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                src={`https://ui-avatars.com/api/?background=random&color=fff&name=User${i}`}
              />
            ))}
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
 * Main Component: Login Logic & Form
 * ========================================= */

export default function LoginPage() {
  const router = useRouter();

  //--- States ---
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    identity: "", //Email hoặc Phone
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");

  //--- Handlers ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    //Clear lỗi khi user bắt đầu gõ lại
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) setGeneralError("");
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.identity.trim())
      errors.identity = "Vui lòng nhập email hoặc số điện thoại";
    if (!formData.password) errors.password = "Vui lòng nhập mật khẩu";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      //Bước 1: Gọi API Login (để trình duyệt nhận Cookie)
      const loginRes = await authService.login({
        email: formData.identity,
        password: formData.password,
      });

      //Bước 2: Kiểm tra xem loginRes có User Info không
      const userData = loginRes;

      //🔥 QUAN TRỌNG: Nếu Login không trả về User, ta gọi ngay /auth/me để lấy
      //if (!userData) {
      //  console.log("Login không trả về user, đang gọi /auth/me...");
      //  const meRes = await authService.getMe(); //Hàm này dùng axiosClient đã có cookie
      //  userData = meRes; //Gán data lấy được
      //}

      //Bước 3: Lưu User Info vào LocalStorage để UI hiển thị
      if (userData) {
        //Tái sử dụng logic lưu và dispatch event
        //Bạn có thể import loginSuccess hoặc viết thẳng vào đây
        localStorage.setItem("user_info", JSON.stringify(userData.data));
        window.dispatchEvent(new Event("auth:changed"));

        setIsSuccess(true);
        setTimeout(() => router.push("/"), 1000);
      } else {
        throw new Error("Không lấy được thông tin người dùng");
      }
    } catch (err: any) {
      console.error("Lỗi:", err);
      setGeneralError(err?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = () =>
    (window.location.href = `${API_URL}/auth/google/redirect`);
  const onFacebook = () =>
    console.log("Login with Facebook (Pending integration)");
  // window.location.href = `${API_URL}/auth/facebook/redirect`;

  return (
    <main className="relative flex min-h-dvh w-full overflow-hidden">
      {/* --- Overlay thành công --- */}
      {isSuccess && <LoadingRedirect />}

      {/* --- Button Home --- */}
      <Link
        href="/"
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md ring-1 ring-black/5 backdrop-blur hover:bg-white transition dark:bg-[#2a1515]/90 dark:text-gray-100 dark:ring-white/10"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Về trang chủ
      </Link>

      <LoginHero />

      {/* --- Form Section --- */}
      <section className="flex-1 bg-white dark:bg-background-dark overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">
                Đăng nhập
              </h2>
              <p className="mt-2 text-text-sub">
                Chào mừng bạn quay trở lại với Sports shop!
              </p>
            </div>

            {/* Error Banner */}
            {generalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-[20px]">
                  error
                </span>
                <span>{generalError}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={onSubmit}>
              <TextField
                name="identity"
                label="Email hoặc Số điện thoại"
                placeholder="VD: 0912345678"
                value={formData.identity}
                onChange={handleChange}
                error={fieldErrors.identity}
              />

              <PasswordField
                name="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-text-main dark:text-gray-300 cursor-pointer">
                  <input
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
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
                className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 
                hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(244,140,37,0.23)] active:translate-y-0
                disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                    Đang xử lý...
                  </span>
                ) : (
                  <>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-white/60 group-hover:text-white transition-colors text-[20px]">
                        login
                      </span>
                    </span>
                    Đăng nhập
                  </>
                )}
              </button>
            </form>

            <Divider text="Hoặc tiếp tục với" />

            <div className="grid grid-cols-2 gap-3">
              <SocialButton
                label="Google"
                icon={<GoogleIcon />}
                onClick={onGoogle}
              />
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
                href="/dang-ky"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
