"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface QuickLink {
  name: string;
  href: string;
}

const QUICK_LINKS: QuickLink[] = [
  { name: "HOME", href: "#home" },
  { name: "ABOUT", href: "#about" },
  { name: "SKILLS", href: "#skills" },
  { name: "PROJECTS", href: "#projects" },
];

const SOCIAL_LINKS = [
  { name: "INSTAGRAM", href: "https://www.instagram.com/coding_with_rl" },
  { name: "LINKEDIN", href: "https://www.linkedin.com/in/laiya-raj-y21e502d01/" },
  { name: "GITHUB", href: "https://github.com/rajlaiya" },
];

export default function Footer() {
  const [logoSrc, setLogoSrc] = useState<string>("/assets/service_logo.png");

  // Client-side canvas processor: removes dark background and auto-crops padding for crisp rendering
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/assets/service_logo.png";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        let minX = canvas.width;
        let minY = canvas.height;
        let maxX = 0;
        let maxY = 0;
        let hasContent = false;

        // Detect tight bounding box of logo lettering and strip black background
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = d[idx];
            const g = d[idx + 1];
            const b = d[idx + 2];
            const brightness = Math.max(r, g, b);

            if (brightness < 35) {
              d[idx + 3] = 0;
            } else {
              hasContent = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;

              if (brightness < 100) {
                d[idx + 3] = Math.round(((brightness - 35) / 65) * 255);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        if (hasContent && maxX > minX && maxY > minY) {
          const pad = 12;
          const cropX = Math.max(0, minX - pad);
          const cropY = Math.max(0, minY - pad);
          const cropW = Math.min(canvas.width - cropX, maxX - minX + pad * 2);
          const cropH = Math.min(canvas.height - cropY, maxY - minY + pad * 2);

          const cropCanvas = document.createElement("canvas");
          cropCanvas.width = cropW;
          cropCanvas.height = cropH;
          const cropCtx = cropCanvas.getContext("2d");
          if (cropCtx) {
            cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
            setLogoSrc(cropCanvas.toDataURL("image/png"));
            return;
          }
        }

        setLogoSrc(canvas.toDataURL("image/png"));
      } catch (err) {
        console.error("Canvas transparent logo generation error:", err);
      }
    };
  }, []);

  return (
    <footer className="w-full bg-[#0a0a0c] text-white selection:bg-white selection:text-black rounded-t-[2rem] sm:rounded-t-[3rem] lg:rounded-t-[3.5rem] border-t border-zinc-800/50 shadow-2xl relative z-10">
      {/* Outer container */}
      <div className="w-full max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-12">
        <div className="relative border border-zinc-800 bg-[#09090b] rounded-t-[1.25rem] sm:rounded-t-[1.75rem]">
          
          {/* ========================================================= */}
          {/* TOP BORDER CROSSHAIRS (AT COLUMN INTERSECTIONS)           */}
          {/* ========================================================= */}
          {/* Desktop 4-column divider crosshairs */}
          <div className="hidden lg:block pointer-events-none select-none">
            <span className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
            <span className="absolute top-0 left-2/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
            <span className="absolute top-0 left-3/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
          </div>

          {/* ========================================================= */}
          {/* UPPER TIER: 4 COLUMNS                                     */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            
            {/* COLUMN 1: Logo & Tagline */}
            <div className="px-6 py-5 sm:px-8 md:p-8 lg:p-9 border-b md:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between md:min-h-55 rounded-tl-[1.25rem] sm:rounded-tl-[1.75rem]">
              <div>
                <Link
                  href="#home"
                  className="inline-block group focus:outline-none"
                  aria-label="Back to top"
                >
                  <img
                    src={logoSrc}
                    alt="Coding_With_RL"
                    className="h-12 sm:h-14 lg:h-16 w-auto max-w-55 sm:max-w-60 object-contain object-left transition-transform duration-300 group-hover:scale-[1.02] select-none"
                    style={{ mixBlendMode: "screen" }}
                  />
                </Link>
                <p className="mt-3 md:mt-6 text-[0.6875rem] sm:text-xs text-zinc-400 font-mono tracking-wider leading-relaxed uppercase max-w-65">
                  CRAFTING THOUGHTFUL DIGITAL EXPERIENCES BUILT ON CLARITY, PURPOSE, AND PRECISION.
                </p>
              </div>
            </div>

            {/* COLUMN 2: Quick Links Buttons (HOME, ABOUT, SKILLS, PROJECTS) */}
            <div className="border-b md:border-b-0 lg:border-r border-zinc-800 flex flex-col divide-y divide-zinc-800">
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center justify-between flex-1 min-h-11 md:min-h-13 px-6 sm:px-7 text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-all duration-200 font-mono text-xs sm:text-[0.8125rem] tracking-wider uppercase"
                >
                  <span>{item.name}</span>
                  <svg
                    className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-all duration-200 group-hover:translate-x-1 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* COLUMN 3: FOLLOW ON (2-column button grid on mobile) */}
            <div className="md:p-8 lg:p-9 lg:border-r border-zinc-800 flex flex-col justify-start">
              <span className="text-[0.625rem] sm:text-[0.6875rem] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-3 md:mb-4 block max-md:px-6 max-md:pt-5">
                FOLLOW ON
              </span>
              <div className="grid grid-cols-2 border-t border-zinc-800 md:border-t-0 md:flex md:flex-col md:gap-2 font-mono text-xs sm:text-[0.8125rem] tracking-wider">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-zinc-400 hover:text-white transition-colors duration-150 uppercase block py-0.5 max-md:flex max-md:items-center max-md:justify-between max-md:gap-2 max-md:h-11 max-md:px-6 max-md:py-0 max-md:text-zinc-300 max-md:border-b max-md:border-zinc-800 max-md:odd:border-r max-md:last:odd:col-span-2 max-md:last:odd:border-r-0 max-md:hover:bg-white/[0.04]"
                  >
                    <span>{social.name}</span>
                    <svg
                      className="md:hidden w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                ))}

                {/* Mobile only: CONTACT moves here from the lower tier (hidden on mobile) */}
                <Link
                  href="#contact"
                  className="md:hidden group flex items-center justify-between gap-2 h-11 px-6 text-zinc-300 hover:text-white hover:bg-white/[0.04] border-b border-zinc-800 transition-colors duration-150 uppercase"
                >
                  <span>CONTACT</span>
                  <svg
                    className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-all duration-200 group-hover:translate-x-1 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>

                {/* Mobile only: RESUME moves here from the lower tier too, as a full-width row */}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:hidden col-span-2 group flex items-center justify-between gap-2 h-11 px-6 text-zinc-300 hover:text-white hover:bg-white/[0.04] border-b border-zinc-800 transition-colors duration-150 uppercase"
                >
                  <span>RESUME</span>
                  <svg
                    className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>

            {/* COLUMN 4: Statement Quote */}
            <div className="px-6 py-5 sm:px-8 md:p-8 lg:p-9 flex flex-col justify-start rounded-tr-[1.25rem] sm:rounded-tr-[1.75rem]">
              <p className="text-xs sm:text-[0.8125rem] font-mono font-medium text-zinc-300 leading-relaxed uppercase max-w-70 tracking-wider">
                CREATING EXPERIENCES THAT BALANCE AESTHETICS, USABILITY, AND INTENT.
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* MIDDLE HORIZONTAL DIVIDER WITH CROSSHAIRS (md+ only)      */}
          {/* ========================================================= */}
          <div className="relative w-full border-t border-zinc-800 max-md:hidden">
            {/* Desktop crosshairs at middle row */}
            <div className="hidden lg:block pointer-events-none select-none">
              <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-2/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-3/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
            </div>
            {/* Mobile crosshairs */}
            <div className="lg:hidden pointer-events-none select-none">
              <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
            </div>

            {/* ======================================================= */}
            {/* LOWER TIER (BOOK A CALL, CONTACT, RESUME, CREATED BY)   */}
            {/* ======================================================= */}
            <div className="grid grid-cols-2 lg:grid-cols-4">

              {/* COL 1: BOOK A CALL */}
              <Link
                href="#contact"
                className="group flex items-center justify-between h-13.5 px-8 lg:border-r border-zinc-800 hover:bg-white/[0.04] transition-all duration-200 font-mono text-xs sm:text-[0.8125rem] tracking-wider text-zinc-300 hover:text-white uppercase"
              >
                <span>BOOK A CALL</span>
                <svg
                  className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-all duration-200 group-hover:translate-x-1 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>

              {/* COL 2: CONTACT */}
              <Link
                href="#contact"
                className="group flex items-center justify-between h-13.5 px-8 lg:border-r border-zinc-800 hover:bg-white/[0.04] transition-all duration-200 font-mono text-xs sm:text-[0.8125rem] tracking-wider text-zinc-300 hover:text-white uppercase"
              >
                <span>CONTACT</span>
                <svg
                  className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-all duration-200 group-hover:translate-x-1 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>

              {/* COL 3: RESUME (opens the PDF from /public in a new tab) */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between h-13.5 px-8 lg:border-r border-zinc-800 hover:bg-white/[0.04] transition-all duration-200 font-mono text-xs sm:text-[0.8125rem] tracking-wider text-zinc-300 hover:text-white uppercase"
              >
                <span>RESUME</span>
                <svg
                  className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>

              {/* COL 4: DESIGN AND DEVELOP BY */}
              <div className="flex items-center h-13.5 px-8 gap-2 font-mono text-[0.6875rem] sm:text-xs tracking-wider text-zinc-500 uppercase whitespace-nowrap overflow-hidden">
                <span>DESIGN AND DEVELOP BY</span>
                <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 shrink-0 inline-flex items-center justify-center">
                  <img
                    src="/assets/new_img.png"
                    alt="Coding_with_rl"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="text-zinc-200 font-semibold hover:text-white transition-colors normal-case">
                  Coding_with_rl
                </span>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM HORIZONTAL DIVIDER WITH CROSSHAIRS (ABOVE BRANDING)*/}
          {/* ========================================================= */}
          <div className="relative w-full border-t border-zinc-800">
            {/* Desktop crosshairs above branding banner */}
            <div className="hidden lg:block pointer-events-none select-none">
              <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-2/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-3/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
            </div>
            {/* Mobile crosshairs */}
            <div className="lg:hidden pointer-events-none select-none">
              <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
            </div>

            {/* ======================================================= */}
            {/* GIGANTIC BRANDING: "CODE WITH RL" WITH HOVER ANIMATION  */}
            {/* ======================================================= */}
            <Link
              href="#home"
              className="group relative w-full overflow-hidden py-5 sm:py-8 md:py-12 lg:py-14 px-2 sm:px-4 flex flex-col items-center justify-center select-none bg-black cursor-pointer focus:outline-none"
              aria-label="Back to top"
            >
              {/* Ambient radial glow bloom on hover */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl bg-[radial-gradient(circle,rgba(59,130,246,0.25)_0%,rgba(147,51,234,0.15)_50%,transparent_75%)]"
                aria-hidden="true"
              />

              {/* Floating 'BACK TO TOP ↑' pill badge on hover */}
              <div
                className="absolute top-2 sm:top-4 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-[0.625rem] sm:text-xs font-mono tracking-widest text-zinc-300 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none shadow-xl z-20 flex items-center gap-1.5"
                aria-hidden="true"
              >
                <span>BACK TO TOP</span>
                <span className="text-zinc-400 group-hover:-translate-y-0.5 transition-transform duration-200">
                  ↑
                </span>
              </div>

              {/* Interactive kinetic typography */}
              <h2 className="relative text-[12.8vw] font-black tracking-tighter uppercase leading-[0.8] text-center whitespace-nowrap drop-shadow-sm font-sans flex items-center justify-center z-10">
                {"CODE WITH RL".split("").map((char, index) => {
                  if (char === " ") {
                    return (
                      <span key={index} className="inline-block w-[0.25em]">
                        &nbsp;
                      </span>
                    );
                  }
                  return (
                    <span
                      key={index}
                      className="inline-block text-white transition-all duration-200 ease-out group-hover:text-zinc-400 hover:!text-white hover:-translate-y-2 sm:hover:-translate-y-3.5 hover:scale-108 hover:drop-shadow-[0_0_35px_rgba(255,255,255,0.85)] will-change-transform"
                    >
                      {char}
                    </span>
                  );
                })}
              </h2>
            </Link>

            {/* Bottom corner crosshairs */}
            <div className="border-t border-zinc-800 relative w-full h-0 pointer-events-none select-none">
              <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="hidden lg:block absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="hidden lg:block absolute top-0 left-2/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="hidden lg:block absolute top-0 left-3/4 -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
              <span className="absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs z-30">+</span>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}
