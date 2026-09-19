"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "ervon",
    title: "ERVON",
    category: "Enterprise SaaS & CRM",
    tagline: "CRM Platforms That Transform Your Business",
    description:
      "Corporate-grade customer relationship management software built for modern scaling teams with business intelligence dashboards and cross-platform workflows.",
    tags: ["Full-Stack MERN", "Cloud Architecture", "Next.js", "PostgreSQL"],
    image: "/projects/Ervon.png",
    liveUrl: "https://www.ervontech.com/",
  },
  {
    id: "zoya",
    title: "Zoya Monroe",
    category: "Creative Portfolio",
    tagline: "Digital Designer & Creative Direction",
    description:
      "High-impact visual portfolio presenting avant-garde design aesthetics, vibrant color palettes, and bold interactive web layouts developed by Raj Laiya.",
    tags: ["Next.js", "Creative Dev", "Interaction Design", "Tailwind CSS"],
    image: "/projects/zoya_portfolio.png",
    liveUrl: "https://zoya-creative-portfolio.netlify.app/",
  },
  {
    id: "kronosone",
    title: "KRÖNOS ONE",
    category: "Luxury E-Commerce",
    tagline: "Timeless Design, Crafted Different",
    description:
      "A high-precision luxury horology e-commerce web platform featuring dynamic product storytelling, interactive timepiece showcases, and a streamlined shopping experience.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "E-Commerce"],
    image: "/projects/kronosone.png",
    liveUrl: "https://kronos-one.vercel.app/",
  },
  {
    id: "honey",
    title: "Pure Honey",
    category: "Artisanal D2C Store",
    tagline: "A New Look at a Timeless Indulgence",
    description:
      "Editorial direct-to-consumer store with rich natural warmth, highlighting raw wildflower harvest batches with fluid motion and seamless commerce integration.",
    tags: ["Next.js", "Stripe", "UI/UX Design", "Tailwind CSS"],
    image: "/projects/honey.png",
    liveUrl: "https://hey-honeyy.netlify.app/",
  },
  {
    id: "foodies",
    title: "FOODIES",
    category: "Gourmet Dining",
    tagline: "Sense the Art of Food",
    description:
      "An immersive fine-dining digital ordering experience featuring artisanal mocktail menus, instant category filtering, and real-time culinary showcases.",
    tags: ["React", "Node.js", "Express", "Tailwind CSS"],
    image: "/projects/foodies.png",
    liveUrl: "https://foodies-cloud-kitchen.netlify.app/",
  },
];

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? PROJECTS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === PROJECTS.length - 1 ? 0 : prev + 1));
  }, []);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  // 60/120fps Cursor Tracking over the image showcase
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current || !cursorRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stageRef.current && cursorRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
    setIsHovered(true);
  };

  const currentProject = PROJECTS[currentIndex];

  return (
    <section
      id="projects"
      className="relative w-full py-20 sm:py-28 bg-white text-zinc-900 scroll-mt-20 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Completely Unboxed & Minimalist */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-2.5">
            Featured Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
            Selected Projects
          </h2>
        </div>

        {/* ============================================================ */}
        {/* MAIN STAGE: Borderless Showcase with Hover Scaling Animation */}
        {/* Movable Redirect Circle Blur Button on Image Hover           */}
        {/* Both-side Buttons & Single Image at a time                    */}
        {/* NO BOX-TYPE STYLE                                            */}
        {/* ============================================================ */}
        <div
          className="relative w-full max-w-5xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* IMAGE STAGE: Fixed Aspect Ratio, Smooth Crossfade, Hover Scale */}
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full aspect-[16/11] sm:aspect-[16/10] max-h-[580px] flex items-center justify-center px-4 sm:px-10 cursor-none select-none"
          >
            {/* MOVABLE REDIRECT CIRCLE BLUR BUTTON (Follows Cursor) */}
            <div
              ref={cursorRef}
              className="absolute top-0 left-0 pointer-events-none z-30 will-change-transform"
              style={{
                transform: "translate3d(-200px, -200px, 0)",
              }}
            >
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black/75 backdrop-blur-xl border border-white/30 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center text-center p-2 transition-all duration-300 ease-out select-none ${
                  isHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-xs sm:text-[13px] tracking-wider uppercase">
                  <span>Visit</span>
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M17 7H7M17 7V17"
                    />
                  </svg>
                </div>
                <span className="text-[10px] text-zinc-300 font-mono tracking-tight mt-0.5">
                  Live Site
                </span>
              </div>
            </div>

            {/* LEFT BUTTON: Previous Image */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              onMouseEnter={() => setIsHovered(false)}
              onMouseLeave={() => setIsHovered(true)}
              aria-label="Previous Project"
              className="absolute left-1 sm:left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-zinc-950 text-zinc-700 hover:text-white border border-zinc-200/90 hover:border-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer backdrop-blur-sm group"
            >
              <svg
                className="w-5 h-5 -translate-x-0.5 transition-transform duration-200 group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* RIGHT BUTTON: Next Image */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              onMouseEnter={() => setIsHovered(false)}
              onMouseLeave={() => setIsHovered(true)}
              aria-label="Next Project"
              className="absolute right-1 sm:right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-zinc-950 text-zinc-700 hover:text-white border border-zinc-200/90 hover:border-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer backdrop-blur-sm group"
            >
              <svg
                className="w-5 h-5 translate-x-0.5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Interactive Image Showcase (Clicking redirects to project liveUrl) */}
            <a
              href={currentProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${currentProject.title} live website`}
              className="block w-full h-full relative cursor-none"
            >
              {PROJECTS.map((project, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={project.id}
                    className={`absolute inset-0 flex items-center justify-center px-2 sm:px-8 transition-all duration-500 ease-out ${
                      isActive
                        ? "opacity-100 scale-100 pointer-events-auto z-10"
                        : "opacity-0 scale-95 pointer-events-none z-0"
                    }`}
                  >
                    {/* Hover to scaling container without box borders */}
                    <div className="group relative w-full h-full flex items-center justify-center">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={1400}
                        height={920}
                        priority={idx === 0}
                        className="w-auto h-auto max-w-full max-h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-transform duration-700 ease-out group-hover:scale-[1.05] sm:group-hover:scale-[1.07] transform-gpu will-change-transform select-none"
                      />
                    </div>
                  </div>
                );
              })}
            </a>
          </div>

          {/* ========================================================== */}
          {/* PROJECT DETAILS & METADATA (Unboxed, Minimalist, Centered) */}
          {/* ========================================================== */}
          <div className="mt-6 sm:mt-8 text-center max-w-2xl mx-auto px-4">
            {/* Category & Counter */}
            <div className="flex items-center justify-center gap-2.5 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {currentProject.category}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-xs font-mono font-medium text-zinc-400">
                0{currentIndex + 1} / 0{PROJECTS.length}
              </span>
            </div>

            {/* Project Title with Live Link */}
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mb-2">
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors inline-flex items-center gap-2 group/title"
              >
                <span>{currentProject.title}</span>
                <svg
                  className="w-4 h-4 text-zinc-400 group-hover/title:text-blue-600 transition-colors group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </a>
            </h3>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-zinc-600 font-medium mb-3">
              {currentProject.tagline}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed mb-5 max-w-xl mx-auto">
              {currentProject.description}
            </p>

            {/* Minimalist Tech Tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6">
              {currentProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[11px] sm:text-xs font-medium text-zinc-600 bg-zinc-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Interactive Dots / Progress Indicator */}
            <div className="flex items-center justify-center gap-2">
              {PROJECTS.map((project, idx) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to ${project.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? "w-8 bg-zinc-900"
                      : "w-2 bg-zinc-200 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
