type FieldProps = {
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  value: string;
  error?: string; // Thêm prop hiển thị lỗi
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextField({
  label,
  placeholder,
  type = "text",
  name,
  value,
  error,
  onChange,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-[#1c140d] dark:text-gray-200 text-sm font-medium">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border bg-[#fcfaf8] h-12 px-4 text-base text-[#1c140d]
        placeholder:text-[#9c7349]/70 focus:ring-1 transition-all outline-none
        dark:bg-[#2a1515] dark:text-white dark:border-[#3d2020]
        ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-[#e8dbce] focus:border-primary focus:ring-primary"
        }`}
        placeholder={placeholder}
        type={type}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </label>
  );
}