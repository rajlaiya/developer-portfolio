"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [logoSrc, setLogoSrc] = useState<string>("/assets/service_logo.png");

  // Client-side canvas processor: removes the black background and auto-crops empty borders so the logo renders large and crisp
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

        // Strip dark/black background pixels and detect tight bounding box of logo lettering
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = d[idx];
            const g = d[idx + 1];
            const b = d[idx + 2];
            const brightness = Math.max(r, g, b);

            if (brightness < 35) {
              d[idx + 3] = 0; // Completely transparent for dark background
            } else {
              hasContent = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;

              if (brightness < 100) {
                d[idx + 3] = Math.round(((brightness - 35) / 65) * 255); // Smooth anti-aliased edge
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // Auto-crop to exact text boundaries so the logo fills the container without empty black margins
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
    <footer className="w-full bg-[#08080a] text-white py-12 sm:py-16 px-6 sm:px-12 border-t border-zinc-900">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 sm:gap-10">
        
        {/* ========================================================= */}
        {/* LEFT: Coding_With_RL Logo (Without Black Background)     */}
        {/* ========================================================= */}
        <Link
          href="/"
          className="group inline-flex items-center transition-transform duration-300 hover:scale-[1.02]"
        >
          <img
            src={logoSrc}
            alt="Coding_With_RL - Creating the Web's Next Benchmark"
            className="w-64 sm:w-80 lg:w-96 max-w-full h-auto object-contain select-none transition-all duration-300"
            style={{ mixBlendMode: "screen" }}
          />
        </Link>

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
