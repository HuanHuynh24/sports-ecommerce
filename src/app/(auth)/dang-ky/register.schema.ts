

import { z } from "zod";

const phoneVN = /^(0|\+84)[0-9]{9}$/;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
    identity: z
      .string()
      .min(1, "Vui lòng nhập email hoặc số điện thoại")
      .refine(
        (val) =>
          z.string().email().safeParse(val).success ||
          phoneVN.test(val),
        "Email hoặc số điện thoại không hợp lệ"
      ),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "Bạn cần đồng ý điều khoản" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
