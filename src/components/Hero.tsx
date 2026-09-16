import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center pt-8 pb-12 lg:pt-0 lg:pb-8 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-end relative min-h-[520px] lg:min-h-[620px]">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Badge, Name, Title, and Subtitle              */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 z-20 flex flex-col justify-end pb-4 lg:pb-12 text-left order-2 lg:order-1">
            {/* Status / Availability Badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs sm:text-[13px] text-zinc-500 font-normal tracking-tight">
                Available for new projects
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[32px] xl:text-[38px] font-semibold tracking-tight text-zinc-900 leading-[1.18] mb-4">
              Hi, I&apos;m Raj Laiya
              <span className="block text-zinc-800 font-semibold mt-1 whitespace-normal sm:whitespace-nowrap">
                Full-stack Developer
              </span>
            </h1>

            {/* Bio / Description */}
            <p className="text-sm sm:text-[15px] text-zinc-600 leading-relaxed max-w-sm">
              I build scalable web apps with modern technologies like Next.js, Vue.js. Passionate about clean code, and solving real-world problems.
            </p>
          </div>

          {/* ========================================================= */}
          {/* CENTER COLUMN: Hero Portrait (Full Head & Hair Visible)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 z-10 flex justify-center items-end relative order-1 lg:order-2 h-[460px] sm:h-[540px] lg:h-[620px]">
            <div className="group relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] xl:max-w-[500px] h-full flex justify-center items-end cursor-pointer">
              <Image
                src="/assets/new_img.png"
                alt="Raj Laiya - Full-stack Developer"
                width={650}
                height={900}
                priority
                className="w-full h-full object-contain object-bottom select-none pointer-events-none scale-[1.32] lg:scale-[1.38] group-hover:scale-[1.39] lg:group-hover:scale-[1.46] origin-bottom translate-y-3 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                style={{
                  maskImage: "linear-gradient(to bottom, black 72%, transparent 98%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 72%, transparent 98%)",
                }}
              />
              {/* Bottom gradient fade for 100% seamless transition to pure white */}
              <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Lead-Generation Pitch & CTA Button           */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 z-20 flex flex-col justify-end pb-4 lg:pb-12 text-left order-3">
            {/* Impact Statement / Lead Generation Paragraph */}
            <p className="text-xs sm:text-[13px] lg:text-[14px] text-zinc-600 leading-[1.65] max-w-xs sm:max-w-sm mb-5">
              As a full-stack engineer, I partner with ambitious founders and teams to architect fast, resilient web applications that convert. From scalable architecture to intuitive UI, turning ideas into reliable products that drive revenue.
            </p>

            {/* Email Me CTA Button */}
            <div>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-black text-white text-xs sm:text-[13px] font-medium tracking-tight shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:bg-zinc-800 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                Email Me
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
