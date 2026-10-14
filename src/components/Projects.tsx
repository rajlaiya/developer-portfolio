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
  // Mobile slides load lazily until the carousel nears the viewport, then all at once so a swipe never lands on a blank slide
  const [preloadSlides, setPreloadSlides] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

  // Mobile carousel: scroll to the slide when the index changes from the dots or keys
  // (no-op on md+ where the track is hidden, and when the index came from a swipe)
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    if (Math.round(track.scrollLeft / track.clientWidth) !== currentIndex) {
      track.scrollTo({ left: currentIndex * track.clientWidth, behavior: "smooth" });
    }
  }, [currentIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPreloadSlides(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Native scroll-snap moves the slides with the finger; React only hears which slide is centred
  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    setCurrentIndex(Math.max(0, Math.min(PROJECTS.length - 1, idx)));
  };

  // Touch swipe handlers (md+ image stage, e.g. tablets)
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

  // Rendered twice: under the mobile carousel, beside the arrows on md+
  const progressDots = PROJECTS.map((project, idx) => (
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
  ));

  // Shared by every mobile slide and the md+ details column
  const renderDetails = (project: ProjectItem, idx: number) => (
    <>
      {/* Category & Counter */}
      <div className="flex items-center gap-2.5 mb-[clamp(0.25rem,1svh,0.75rem)] md:mb-3">
        <span className="text-[0.6875rem] md:text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {project.category}
        </span>
        <span className="text-zinc-300">•</span>
        <span className="text-[0.6875rem] md:text-xs font-mono font-medium text-zinc-400">
          0{idx + 1} / 0{PROJECTS.length}
        </span>
      </div>

      {/* Project Title with Live Link */}
      <h3 className="text-[clamp(1.5rem,3.8svh,2.25rem)] max-md:leading-[1.15] md:text-4xl font-bold tracking-tight text-zinc-900 mb-[clamp(0.25rem,1svh,0.75rem)] md:mb-3">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors inline-flex items-center gap-2 group/title"
        >
          <span>{project.title}</span>
          <svg
            className="w-5 h-5 text-zinc-400 group-hover/title:text-blue-600 transition-colors group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5"
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
      <p className="text-[clamp(0.875rem,2svh,1rem)] max-md:leading-snug md:text-lg text-zinc-700 font-medium mb-[clamp(0.25rem,1svh,0.75rem)] md:mb-3">
        {project.tagline}
      </p>

      {/* Description */}
      <p className="text-[clamp(0.8125rem,1.75svh,0.9375rem)] md:text-[0.9375rem] text-zinc-500 leading-relaxed mb-[clamp(0.5rem,1.8svh,1.5rem)] md:mb-6 max-w-md">
        {project.description}
      </p>

      {/* Minimalist Tech Tags */}
      <div className="flex flex-wrap items-center gap-2 md:mb-8">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="whitespace-nowrap px-3 py-1 text-[0.6875rem] sm:text-xs font-medium text-zinc-600 bg-zinc-100 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );

  return (
    // Mobile: the whole section fits one screen (below the fixed 3.5625rem navbar),
    // with sizes and gaps scaling to the screen height and the image shrinking to fit what is left
    <section
      id="projects"
      className="relative w-full h-svh min-h-[34rem] md:h-auto md:min-h-0 flex flex-col justify-center md:block pt-[calc(3.5625rem+clamp(0.5rem,2svh,1.25rem))] pb-[clamp(0.75rem,3svh,1.5rem)] md:py-28 bg-white text-zinc-900 md:scroll-mt-20 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 max-md:flex max-md:flex-col max-md:min-h-0">
        {/* Section Header - Completely Unboxed & Minimalist */}
        <div className="shrink-0 text-center mb-[clamp(0.75rem,2.2svh,1.5rem)] md:mb-14">
          <span className="text-[0.6875rem] md:text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-1 md:mb-2.5">
            Featured Works
          </span>
          <h2 className="text-[clamp(1.375rem,3.4svh,1.875rem)] max-md:leading-[1.15] md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
            Selected Projects and products
          </h2>
        </div>

        {/* ============================================================ */}
        {/* MOBILE: native swipe carousel, one full-width slide per      */}
        {/* project (image + details), dots underneath                   */}
        {/* ============================================================ */}
        <div className="md:hidden flex flex-col min-h-0">
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            className="flex min-h-0 -mx-6 sm:-mx-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {PROJECTS.map((project, idx) => (
              <article
                key={project.id}
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${PROJECTS.length}: ${project.title}`}
                className="w-full shrink-0 snap-center snap-always px-6 sm:px-8 flex flex-col min-h-0"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} live website`}
                  className="block min-h-20 h-[clamp(7.5rem,30svh,17rem)] mb-[clamp(0.75rem,2.2svh,1.5rem)]"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={1536}
                    height={1024}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    loading={preloadSlides ? "eager" : "lazy"}
                    draggable={false}
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.1)] select-none"
                  />
                </a>
                {renderDetails(project, idx)}
              </article>
            ))}
          </div>

          <div className="shrink-0 flex items-center justify-center gap-2 mt-[clamp(0.75rem,2.2svh,1.25rem)]">
            {progressDots}
          </div>
        </div>

        {/* ============================================================ */}
        {/* MD+: Image showcase left, project details right              */}
        {/* (stacks image -> details below lg)                           */}
        {/* ============================================================ */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ========================================================== */}
          {/* LEFT: Borderless Image Stage with Hover Scale & Cursor Pill */}
          {/* ========================================================== */}
          <div
            className="lg:col-span-7"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full aspect-[3/2] cursor-none select-none"
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
                  <div className="flex items-center gap-1 font-bold text-xs sm:text-[0.8125rem] tracking-wider uppercase">
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
                  <span className="text-[0.625rem] text-zinc-300 font-mono tracking-tight mt-0.5">
                    Live Site
                  </span>
                </div>
              </div>

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
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
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
                          width={1536}
                          height={1024}
                          sizes="(min-width: 1024px) 58vw, 100vw"
                          className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.1)] scale-[1.1] transition-transform duration-700 ease-out group-hover:scale-[1.15] sm:group-hover:scale-[1.17] transform-gpu will-change-transform select-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </a>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT: Project Details, Live CTA & Slider Controls          */}
          {/* ========================================================== */}
          <div className="lg:col-span-5">
            {/* Re-keyed per project so the details fade in on every switch */}
            <div key={currentProject.id} className="motion-safe:animate-fade-up">
              {renderDetails(currentProject, currentIndex)}

              {/* Visit Live Site CTA */}
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs sm:text-[0.8125rem] font-semibold tracking-tight shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:bg-zinc-800 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                <span>Visit Live Site</span>
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>

            {/* Slider Controls: Progress Dots + Prev / Next */}
            <div className="mt-10 pt-6 border-t border-zinc-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">{progressDots}</div>

              <div className="flex items-center gap-3">
                {/* PREVIOUS BUTTON */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous Project"
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-zinc-950 text-zinc-700 hover:text-white border border-zinc-200/90 hover:border-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
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

                {/* NEXT BUTTON */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next Project"
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-zinc-950 text-zinc-700 hover:text-white border border-zinc-200/90 hover:border-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
