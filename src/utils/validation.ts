// src/utils/validation.ts

// 1. Định nghĩa Regex tại đây để dễ quản lý
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  VIETNAM_PHONE: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
};

// 2. Định nghĩa Interface cho dữ liệu đầu vào
export interface RegisterFormValues {
  name: string;
  identity: string;
  password: string;
  confirmPassword: string;
}

// 3. Hàm validate chính (Pure Function - Không phụ thuộc React State)
export const validateRegisterForm = (values: RegisterFormValues) => {
  const errors: Partial<Record<keyof RegisterFormValues, string>> = {};

  // Validate Name
  if (!values.name.trim()) {
    errors.name = "Vui lòng nhập họ và tên";
  }

  // Validate Identity (Email/Phone)
  const identity = values.identity.trim();
  if (!identity) {
    errors.identity = "Vui lòng nhập email hoặc số điện thoại";
  } else {
    const isEmail = REGEX.EMAIL.test(identity);
    const isPhone = REGEX.VIETNAM_PHONE.test(identity);

    if (!isEmail && !isPhone) {
      errors.identity = "Định dạng email hoặc số điện thoại không hợp lệ";
    }
  }

  // Validate Password
  if (!REGEX.PASSWORD.test(values.password)) {
    errors.password =
      "Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.";
  }

  // Validate Confirm Password
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Mật khẩu nhập lại không khớp.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 4. Giữ hàm tính điểm sức mạnh password ở đây luôn nếu muốn
export const calculatePasswordStrength = (password: string): number => {
  let score = 0;
  if (!password) return 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) && password.length > 10) score += 1;

  return Math.min(score, 4);
};