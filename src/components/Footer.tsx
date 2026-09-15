import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#08080a] text-white py-14 sm:py-20 px-6 sm:px-12 border-t border-zinc-900">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        
        {/* ========================================================= */}
        {/* LEFT: Geometric Red Brand Logo & Name                     */}
        {/* ========================================================= */}
        <div className="flex items-center gap-4 group">
          {/* Geometric Red Accent Emblem (matching ERVON style in reference) */}
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center">
            <svg
              className="w-full h-full text-red-600 transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Dynamic curved angular polygon */}
              <path
                d="M8 8L38 18L32 40L14 36L8 8Z"
                fill="#EF4444"
              />
              <path
                d="M20 18C20 15.7909 21.7909 14 24 14C26.2091 14 28 15.7909 28 18C28 20.2091 26.2091 22 24 22C21.7909 22 20 20.2091 20 18Z"
                fill="#08080A"
              />
            </svg>
          </div>

          {/* Brand Name */}
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-[0.2em] uppercase text-white font-mono">
              RAJ LAIYA
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-widest text-zinc-500 uppercase font-medium">
              Full-Stack Engineering & Web Architecture
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT: Monospace Social Links, Phone & Copyright          */}
        {/* ========================================================= */}
        <div className="flex flex-col items-start md:items-end gap-3 text-left md:text-right">
          {/* Social Navigation Links in Monospace Uppercase */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-7 text-xs font-semibold tracking-wider uppercase text-zinc-300 font-mono">
            <a
              href="https://www.linkedin.com/in/laiya-raj-y21e502d01/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LINKEDIN
            </a>
            <a
              href="https://www.instagram.com/coding_with_rl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              INSTAGRAM
            </a>
            <a
              href="mailto:rajlaiya2017@gmail.com"
              className="hover:text-white transition-colors"
            >
              EMAIL
            </a>
          </div>

          {/* Direct Phone Number */}
          <div className="text-xs sm:text-sm font-mono font-medium text-zinc-400 mt-1">
            <a href="tel:+916355705208" className="hover:text-white transition-colors">
              +91 6355705208
            </a>
          </div>

          {/* Copyright Line */}
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">
            © 2026 Raj Laiya. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
