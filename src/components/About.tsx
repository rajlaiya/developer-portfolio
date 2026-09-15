"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalScrollable = rect.height - windowHeight;

          if (totalScrollable > 0) {
            const currentScroll = -rect.top;
            const rawProgress = currentScroll / totalScrollable;
            const clamped = Math.max(0, Math.min(1, rawProgress));
            setProgress(clamped);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Eco.com style content structured professionally
  const topHeading =
    "MERN Stack Developer with 2.5+ years of experience building actual production web applications.";

  const bodyText =
    "I love creating seamless user experiences and robust backend systems. My goal is to deliver high-quality, maintainable code and collaborate with ambitious teams to bring ideas to life with speed and precision.";

  // Words breakdown for word-wrapping safety with global character indexing
  const words = useMemo(() => {
    const rawWords = bodyText.split(" ");
    let charOffset = 0;
    return rawWords.map((word) => {
      const startIndex = charOffset;
      const length = word.length;
      charOffset += length + 1; // +1 for the space
      return {
        word,
        startIndex,
        length,
      };
    });
  }, [bodyText]);

  const totalChars = bodyText.length;

  // Animation timeline phases (matching Eco.com):
  // 0.00 -> 0.08: Sticky enters & smooth fade in
  // 0.08 -> 0.82: Active typing / character reveal
  // 0.82 -> 1.00: Exit transition (subtle scale-up + smooth fade-out)
  const revealStart = 0.08;
  const revealEnd = 0.82;

  let revealProgress = 0;
  if (progress >= revealEnd) {
    revealProgress = 1;
  } else if (progress > revealStart) {
    revealProgress = (progress - revealStart) / (revealEnd - revealStart);
  }

  const currentCharFloat = revealProgress * totalChars;

  // Container exit & entrance transforms
  let sectionOpacity = 1;
  let sectionScale = 1;
  let sectionY = 0;

  if (progress < 0.06) {
    sectionOpacity = Math.max(0.2, progress / 0.06);
  } else if (progress > 0.84) {
    const exitProgress = (progress - 0.84) / 0.16; // 0 to 1
    sectionOpacity = Math.max(0, 1 - exitProgress);
    sectionScale = 1 + exitProgress * 0.04;
    sectionY = -exitProgress * 30;
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full h-[260vh] bg-white text-zinc-900"
    >
      {/* Sticky pinned viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 overflow-hidden">
        <div
          className="w-full max-w-4xl xl:max-w-5xl mx-auto flex flex-col items-center justify-center text-center transition-transform duration-75 ease-out select-none"
          style={{
            opacity: sectionOpacity,
            transform: `scale(${sectionScale}) translateY(${sectionY}px)`,
          }}
        >
          {/* Top Intro Hook (Eco.com exact text size & proportion) */}
          <h2 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-normal tracking-[-0.025em] leading-[1.22] text-zinc-900 max-w-3xl xl:max-w-4xl mx-auto mb-6 sm:mb-10 lg:mb-12">
            {topHeading}
          </h2>

          {/* Scrolling Character-by-Character Typing Reveal */}
          <p className="text-xl sm:text-2xl lg:text-[34px] xl:text-[38px] font-normal tracking-[-0.02em] leading-[1.3] text-center max-w-4xl xl:max-w-5xl mx-auto">
            {words.map((item, wIndex) => {
              return (
                <span
                  key={wIndex}
                  className="inline-block whitespace-nowrap mr-[0.28em]"
                >
                  {item.word.split("").map((char, cIndex) => {
                    const globalIndex = item.startIndex + cIndex;
                    // Fully revealed
                    if (globalIndex < Math.floor(currentCharFloat)) {
                      return (
                        <span
                          key={cIndex}
                          className="text-zinc-950 font-normal transition-colors duration-100"
                        >
                          {char}
                        </span>
                      );
                    }
                    // Character currently transitioning (subtle opacity blend)
                    if (globalIndex === Math.floor(currentCharFloat)) {
                      const partialAlpha = currentCharFloat - globalIndex;
                      const opacity = 0.15 + 0.85 * partialAlpha;
                      return (
                        <span
                          key={cIndex}
                          style={{
                            color: `rgba(9, 9, 11, ${opacity})`,
                          }}
                          className="font-normal"
                        >
                          {char}
                        </span>
                      );
                    }
                    // Unrevealed character: faint watermark preview like Eco.com
                    return (
                      <span
                        key={cIndex}
                        className="text-zinc-300 font-normal transition-colors duration-100"
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
