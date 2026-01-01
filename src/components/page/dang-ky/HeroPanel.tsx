import Image from "next/image";

export default function HeroPanel() {
  const bgUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAf2ceNx81paIT6GVeXYh_6P4oeMZZL0RQxIC5aTeNoUoCMILCBae0_oBximrh-We2GzsCL0mR95caWpy5Ol2YKxg7F_rR5SXFY26vq3LRIcIWATfiXOnMLneWVgaSva6D5D0u_S3F0fYAXUXal9YVVQepwhuzDw5oDKTq0UTys8-ChdUYaSnVFuvUckHz27-lXN61O_hNAzUeIjSMPpA9vEyXkL4JRjmEEnTFwsMn2k_3xRXrPwK2xGxoHxZJ7F2xV9Ejjfi5A_g";

  return (
    <section
      className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-12 xl:p-20 bg-cover bg-center group"
      style={{ backgroundImage: `url("${bgUrl}")` }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10 flex flex-col gap-4 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/90 text-white w-fit text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px]">
            verified
          </span>

          <span>Chính hãng 100%</span>
        </div>

        <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
          Đam mê cầu lông <br />
          <span className="text-primary">Chinh phục đỉnh cao</span>
        </h1>

        <p className="text-gray-200 text-lg font-medium leading-relaxed max-w-md">
          Tham gia cộng đồng VNB Sports ngay hôm nay để nhận ưu đãi độc quyền và
          cập nhật những xu hướng mới nhất.
        </p>

        <div className="flex gap-4 mt-4">
          <div className="flex -space-x-3">
            <Image
              width={10}
              height={10}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmDdQcaLx340k7BBLG5RNougo-_njFbcylJN-8CuT28_puCKbqdI5JtRcSz-rAegvVAXBNnufdKNUgcZywdarBjSMOEoHtNl8xDUvN_JW4ArSDwhEcPH62mkUVHXWj3PGMbd2tfp1NwywNxTn1J4Xw4Gw5ASmhHxgZDd40qq1GEx2OH7oE68JUE3y1pnLBWM9rRGKNkLbbNdzP0hGMGw6pdbWOBMUJ1URBoe6BJ5hX1lUwyvUeud1v7Kb8-xfOxxQ3uj7u0dK8cw"
            />

            <Image
              width={10}
              height={10}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe-tVIZ59YvRwRc-DCCB7lt5Q3n9HKzMogEDG38SBfnaY4FxiLb0Nv4D7ukY6tcM7Jq_zo6GR4CeA2YXOwrvIC0RnMlhkBeIuMCG2R5dRy_4THaNTJuH6wNao3EmK2V6VaZyP1sCKfb6thf0qUBfaDLfUC5rKlPlMJDBWKUsFDubDUkiCmxivQjsPoWgU8yR-xIDm7TanRnOCkSOrd00cThQtGnDegeGw2azVabyJPe7Kpa_835-bLSyReaYrYGOjb_U9YSw-_9A"
            />

            <Image
              width={10}
              height={10}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh2zwC-vtvlhFaUN879RMfQL5WXAXwH1hftMMT6YthPN1M5vLwkeuEBzo31aKszpeAjbSzATCQDNt6LG1wknwVFHdPnTL74aDMZc31bKoDrLE6_4SZI8I1vCD4_2qcHQLUYA9uf-aoQd4aa0eXNsl-7-ynh0SViir-ZWoEb8WY3BE1aCz4bUjfA04Yxk7Dcwe1yHO9o_CN8qiE7lwTgX_HgzeaYQqieeT67Ixe4Fu_h6wgyBhuyvEhDnOJDY6_Qw0oL0O-bFrWOw"
            />

            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-xs text-white font-medium">
              +2k
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex text-yellow-400 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[14px] fill-current"
                >
                  star
                </span>
              ))}
            </div>

            <span className="text-gray-300 text-xs">Thành viên tin dùng</span>
          </div>
        </div>
      </div>
    </section>
  );
}
