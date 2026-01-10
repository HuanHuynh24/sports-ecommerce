"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  User, Mail, Phone, Camera, Save, Lock, 
  Calendar, Loader2, LogOut 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Services & Types
import { authService, UserProfile } from "@/services/auth.service";

export default function AccountPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State dữ liệu
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // State password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State Avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 1. Fetch dữ liệu User khi vào trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getMe();
        if (userData) {
          setUser(userData);
          // Fill dữ liệu vào form
          setName(userData.name || "");
          setPhone(userData.phone || "");
          setAvatarPreview(userData.avatar_url);
        } else {
          // Nếu không lấy được user (chưa login), đá về trang login
          router.push("/login");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // 2. Xử lý khi chọn ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate sơ bộ (Backend đã có validate, nhưng FE nên chặn trước cho UX)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ảnh không được quá 2MB");
        return;
      }
      setAvatarFile(file);
      // Tạo URL preview ảnh ngay lập tức
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // 3. Xử lý Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Tạo FormData
      const formData = new FormData();
      formData.append("name", name);
      
      // Chỉ gửi phone nếu có giá trị
      if (phone) formData.append("phone", phone);

      // Nếu có file ảnh mới thì gửi lên
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Xử lý mật khẩu
      if (password || confirmPassword) {
        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            setIsSaving(false);
            return;
        }
        if (password.length < 8) {
            toast.error("Mật khẩu phải từ 8 ký tự trở lên!");
            setIsSaving(false);
            return;
        }
        formData.append("password", password);
        formData.append("password_confirmation", confirmPassword);
      }

      // Gọi API
      const res: any = await authService.updateProfile(formData);

      // Kiểm tra kết quả (Tùy cấu trúc trả về của BE bạn)
      // Giả sử res.data là User Resource mới
      if (res) { 
        toast.success("Cập nhật hồ sơ thành công!");
        // Reset password fields
        setPassword("");
        setConfirmPassword("");
        // Cập nhật lại user state nếu cần thiết hoặc reload
        // router.refresh(); 
      }
    } catch (error: any) {
      console.error("Update Error:", error);
      // Hiển thị lỗi từ BE (ví dụ Validation Error)
      const msg = error?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Loading UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hồ sơ cá nhân</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý thông tin tài khoản và bảo mật.</p>
          </div>
          <button 
             onClick={async () => {
                 await authService.logout();
                 router.push('/dang-nhap');
             }}
             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Avatar & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
              
              {/* Avatar Upload */}
              <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 relative bg-gray-200">
                  {avatarPreview ? (
                     // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Overlay khi hover */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 uppercase">
                {user.role}
              </div>

              <div className="w-full border-t border-gray-100 dark:border-gray-800 mt-6 pt-6 flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Tham gia
                </span>
                <span>{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-red-600" />
                    Thông tin cơ bản
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Email (Read only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <div className="relative">
                        <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="email" 
                            value={user.email} 
                            disabled 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi.</p>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Họ và tên</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Số điện thoại</label>
                        <div className="relative">
                            <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                    </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                    <Lock className="w-5 h-5 text-red-600" />
                    Đổi mật khẩu
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mật khẩu mới</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            placeholder="Để trống nếu không đổi"
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Xác nhận mật khẩu</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                            placeholder="Nhập lại mật khẩu mới"
                            autoComplete="new-password"
                        />
                    </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang lưu...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Lưu thay đổi
                        </>
                    )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}