"use client";

import React, { useState } from "react";

type PasswordFieldProps = {
  label: string;
  placeholder?: string;
  name?: string;
  value: string;
  error?: string;
  strength?: number; //Nhận điểm sức mạnh (0-4)
  showStrengthBar?: boolean; //Có hiển thị thanh sức mạnh không
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordField({
  label,
  placeholder,
  name,
  value,
  error,
  strength = 0,
  showStrengthBar = false,
  onChange,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  //Helper chọn màu dựa trên strength
  const getBarColor = (index: number) => {
    if (strength > index) {
      if (strength <= 2) return "bg-red-500";
      if (strength === 3) return "bg-yellow-500";
      return "bg-green-500";
    }
    return "bg-gray-200 dark:bg-gray-700";
  };

  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-[#1c140d] dark:text-gray-200 text-sm font-medium">
        {label}
      </span>

      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border bg-[#fcfaf8] h-12 pl-4 pr-12 text-base text-[#1c140d]
          placeholder:text-[#9c7349]/70 focus:ring-1 transition-all outline-none
          dark:bg-[#2a1515] dark:text-white dark:border-[#3d2020]
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#e8dbce] focus:border-primary focus:ring-primary"
          }`}
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

      {/* 3. Strength bar update dynamically */}
      {showStrengthBar && value.length > 0 && (
        <div className="flex gap-1 h-1 mt-1 transition-all">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`flex-1 rounded-full transition-colors duration-300 ${getBarColor(
                index
              )}`}
            />
          ))}
        </div>
      )}

      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </label>
  );
}