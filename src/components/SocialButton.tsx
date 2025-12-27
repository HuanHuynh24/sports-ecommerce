export default function SocialButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 shadow-sm
      hover:bg-gray-50 hover:border-gray-300
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
      transition-all
      dark:bg-[#2a221b] dark:border-gray-700 dark:text-gray-200 dark:hover:bg-[#362b22]"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
