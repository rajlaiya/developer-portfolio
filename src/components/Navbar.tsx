"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "HOME", href: "#home" },
  { name: "ABOUT", href: "#about" },
  { name: "SKILLS", href: "#skills" },
  { name: "PROJECTS", href: "#projects" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("HOME");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      const allItems = [...NAV_ITEMS, { name: "CONTACT", href: "#contact" }];

      for (let i = allItems.length - 1; i >= 0; i--) {
        const item = allItems[i];
        const el = document.querySelector(item.href);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSection(item.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      {/* 
        Container with drop-shadow filter so the shadow follows 
        the continuous silhouette of the center notch + both curved ears.
      */}
      <div className="relative pointer-events-auto filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.18)]">
        
        {/* ======================================================== */}
        {/* LEFT INVERTED CURVED CORNER (Ears / Concave Fillet)      */}
        {/* ======================================================== */}
        <div 
          className="absolute top-0 right-full pointer-events-none select-none"
          style={{ width: "20px", height: "20px", marginRight: "-0.5px" }}
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-full text-black fill-current"
          >
            {/*
              Concave fillet curve:
              Starts at (0, 0) tangent to top edge (dy/dx = 0),
              curves smoothly to (20, 20) tangent to navbar left vertical edge (dx/dy = 0),
              then completes the corner up to (20, 0) and back to (0, 0).
            */}
            <path
              d="M 0 0 C 11.0457 0 20 8.9543 20 20 V 0 H 0 Z"
              fill="#000000"
            />
          </svg>
        </div>

        {/* ======================================================== */}
        {/* RIGHT INVERTED CURVED CORNER (Ears / Concave Fillet)     */}
        {/* ======================================================== */}
        <div 
          className="absolute top-0 left-full pointer-events-none select-none"
          style={{ width: "20px", height: "20px", marginLeft: "-0.5px" }}
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-full text-black fill-current"
          >
            {/*
              Symmetrical concave fillet:
              Starts at (0, 20) tangent to navbar right vertical edge (dx/dy = 0),
              curves smoothly to (20, 0) tangent to top edge (dy/dx = 0),
              then completes the corner back to (0, 0) and down to (0, 20).
            */}
            <path
              d="M 0 20 C 0 8.9543 8.9543 0 20 0 H 0 V 20 Z"
              fill="#000000"
            />
          </svg>
        </div>

        {/* ======================================================== */}
        {/* MAIN NAVBAR NOTCH BODY                                   */}
        {/* ======================================================== */}
        <nav
          className="relative bg-black text-white h-[52px] sm:h-[54px] px-3.5 sm:px-5 flex items-center gap-3 sm:gap-6 rounded-b-[20px] select-none"
          aria-label="Main Navigation"
        >
          {/* Brand Logo & Title */}
          <Link
            href="#home"
            className="flex items-center gap-2.5 group focus:outline-none"
            onClick={() => setActiveSection("HOME")}
          >
            {/* Glossy 3D Blue Icon (Supaste-style squircle app icon) */}
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-[9px] bg-gradient-to-b from-[#2e90fa] via-[#1570ef] to-[#175cd3] p-[1px] shadow-[0_2px_8px_rgba(23,92,211,0.5),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
              {/* Gloss highlight on top half */}
              <div className="absolute top-0 left-0 right-0 h-[48%] bg-gradient-to-b from-white/60 to-white/10 rounded-t-[8px] pointer-events-none" />
              
              {/* Internal subtle icon graphic */}
              <svg
                className="w-4 h-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m16 18 6-6-6-6" />
                <path d="m8 6-6 6 6 6" />
              </svg>
            </div>

            {/* Brand Text */}
            <span className="font-semibold text-[14px] sm:text-[15px] tracking-tight text-white transition-opacity group-hover:opacity-90">
              Portfolio
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 sm:gap-4 lg:gap-5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.name;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveSection(item.name)}
                  className={`text-[12px] lg:text-[13px] tracking-wide transition-colors duration-200 uppercase ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-zinc-400 hover:text-white font-medium"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Button: CONTACT (White pill button like 'Download' in reference) */}
          <div className="flex items-center gap-2">
            <Link
              href="#contact"
              onClick={() => setActiveSection("CONTACT")}
              className="group relative flex items-center gap-1.5 bg-white text-black text-[11px] sm:text-[12px] font-bold tracking-wider uppercase px-3.5 sm:px-4 py-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:bg-zinc-100 hover:shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-all duration-150 active:scale-95"
            >
              <svg
                className="w-3.5 h-3.5 text-black transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              <span>CONTACT</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu (Clean, animated dark card) */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 bg-black/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 z-50">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveSection(item.name);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-semibold tracking-wider rounded-lg uppercase transition-colors ${
                  activeSection === item.name
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
