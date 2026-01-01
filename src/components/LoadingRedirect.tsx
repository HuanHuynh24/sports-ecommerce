/* =========================
 * Component: Full Page Loading/Success
 * ========================= */
export const LoadingRedirect = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 dark:bg-[#1c140d]/95 backdrop-blur-sm transition-all">
      {/* Icon Success + Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Vòng tròn xoay */}
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
        {/* Icon check ở giữa */}
        <span className="material-symbols-outlined absolute text-3xl text-primary font-bold">
          check
        </span>
      </div>
      
      <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white animate-pulse">
        Đăng ký thành công!
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Đang đưa bạn về trang chủ...
      </p>
    </div>
  );
};