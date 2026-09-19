"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let animationFrameId: number;

    const updateScrollProgress = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable > 0) {
        const currentScroll = -rect.top;
        const rawProgress = currentScroll / totalScrollable;
        const clamped = Math.max(0, Math.min(1, rawProgress));
        setProgress(clamped);
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Exact portfolio text - untouched
  const topHeading =
    "MERN Stack Developer with 2.5+ years of experience building actual production web applications.";

  const bodyText =
    "I love creating seamless user experiences and robust backend systems. My goal is to deliver high-quality, maintainable code and collaborate with ambitious teams to bring ideas to life with speed and precision.";

  const headingWords = useMemo(() => topHeading.split(" "), [topHeading]);
  const bodyWords = useMemo(() => bodyText.split(" "), [bodyText]);
  const totalWords = headingWords.length + bodyWords.length; // 13 + 32 = 45 words

  // Animation timeline over generous scroll distance (h-[320vh]):
  // 0.04 -> 0.85: Slow, smooth word-by-word reveal as user scrolls through pinned section
  // 0.85 -> 1.00: Full text stays 100% illuminated in place for clear reading before scrolling to next section
  const revealStart = 0.04;
  const revealEnd = 0.85;

  let revealProgress = 0;
  if (progress >= revealEnd) {
    revealProgress = 1;
  } else if (progress > revealStart) {
    revealProgress = (progress - revealStart) / (revealEnd - revealStart);
  }

  const activeWordFloat = revealProgress * totalWords;

  // Render an individual word with smooth scroll illumination
  const renderWord = (word: string, globalIndex: number) => {
    // Word is already revealed
    if (globalIndex < Math.floor(activeWordFloat)) {
      return (
        <span
          key={globalIndex}
          className="inline-block whitespace-nowrap mr-[0.28em] text-zinc-950 font-normal transition-colors duration-150"
        >
          {word}
        </span>
      );
    }

    // Word is currently being revealed (smooth opacity transition)
    if (globalIndex === Math.floor(activeWordFloat)) {
      const partial = activeWordFloat - globalIndex;
      const opacity = 0.18 + 0.82 * partial;
      return (
        <span
          key={globalIndex}
          className="inline-block whitespace-nowrap mr-[0.28em] font-normal transition-colors duration-75"
          style={{
            color: `rgba(9, 9, 11, ${opacity})`,
          }}
        >
          {word}
        </span>
      );
    }

    // Word is unrevealed (faint watermark preview)
    return (
      <span
        key={globalIndex}
        className="inline-block whitespace-nowrap mr-[0.28em] font-normal transition-colors duration-150"
        style={{
          color: "rgba(9, 9, 11, 0.18)",
        }}
      >
        {word}
      </span>
    );
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full h-[320vh] bg-white text-zinc-900 font-quantico"
      style={{ fontFamily: "'Quantico', sans-serif" }}
    >
      {/* React 19 hoisted Google Fonts stylesheet */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Quantico:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        precedence="default"
      />

      {/* Embedded style block guaranteeing Quantico overrides all styles in #about */}
      <style>{`
        @font-face {
          font-family: 'Quantico';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url('/fonts/Quantico-Regular.ttf') format('truetype'),
               url('https://fonts.gstatic.com/s/quantico/v19/rax-HiSdp9cPL3KIF4xs.ttf') format('truetype');
        }

        @font-face {
          font-family: 'Quantico';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: url('/fonts/Quantico-Bold.ttf') format('truetype'),
               url('https://fonts.gstatic.com/s/quantico/v19/rax5HiSdp9cPL3KIF7TQARha.ttf') format('truetype');
        }

        #about,
        #about h2,
        #about p,
        #about span,
        #about div {
          font-family: 'Quantico', sans-serif !important;
        }
      `}</style>

      {/* Sticky pinned viewport container: holds position firmly while scrolling */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 overflow-hidden">
        <div
          className="w-full max-w-4xl xl:max-w-5xl mx-auto flex flex-col items-center justify-center text-center select-none"
          style={{
            fontFamily: "'Quantico', sans-serif",
          }}
        >
          {/* Top Intro Hook */}
          <h2
            className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-normal tracking-normal leading-[1.28] text-center max-w-3xl xl:max-w-4xl mx-auto mb-6 sm:mb-10 lg:mb-12"
            style={{ fontFamily: "'Quantico', sans-serif" }}
          >
            {headingWords.map((word, index) => renderWord(word, index))}
          </h2>

          {/* Scrolling Word-by-Word Reveal */}
          <p
            className="text-xl sm:text-2xl lg:text-[34px] xl:text-[38px] font-normal tracking-normal leading-[1.38] text-center max-w-4xl xl:max-w-5xl mx-auto"
            style={{ fontFamily: "'Quantico', sans-serif" }}
          >
            {bodyWords.map((word, index) =>
              renderWord(word, headingWords.length + index)
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
