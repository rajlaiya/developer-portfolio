"use client";

import React, { useState } from "react";

interface ExperienceEntry {
  id: string;
  label: string; // short caption under the tile
  title: string;
  tagline: string; // date range pill next to the title
  role?: string; // blue line under the title (job title or grade)
  description: string;
  highlights: string[];
  gradient: string;
  shadowColor: string;
  icon: React.ReactNode;
}

const PROFESSIONAL: ExperienceEntry[] = [
  {
    id: "ervon",
    label: "Ervon",
    title: "Ervon Technology Pvt. Ltd.",
    tagline: "Jun 2024 – Present",
    role: "AI MERN Stack Developer | Technical Team Lead",
    description:
      "Handling live projects, building robust full-stack web solutions, and managing production application deployments.",
    highlights: [
      "Leading the technical team through sprint planning, code reviews, and architecture decisions to ship features on schedule.",
      "Integrating AI-powered features (LLM APIs, chatbots, and smart automation) into scalable MERN applications.",
    ],
    gradient: "from-[#0071e3] to-[#147efb]",
    shadowColor: "rgba(0,113,227,0.35)",
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </svg>
    ),
  },
  {
    id: "kombee",
    label: "Kombee",
    title: "Kombee Private Limited",
    tagline: "Feb 2024 – May 2024",
    role: "Junior Vue.js Frontend Developer",
    description: "Built and maintained client-facing web applications using Vue.js.",
    highlights: [
      "Developed reusable, responsive UI components and integrated REST APIs for dynamic, data-driven interfaces.",
      "Collaborated with designers and backend developers in an agile workflow to deliver pixel-perfect, cross-browser features.",
    ],
    gradient: "from-[#34c759] to-[#30b050]",
    shadowColor: "rgba(52,199,89,0.35)",
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
  },
];

const EDUCATION: ExperienceEntry[] = [
  {
    id: "diploma",
    label: "Diploma",
    title: "Diploma in Electronics & Communication",
    tagline: "Jun 2018 – May 2021",
    role: "1st Class Distinction",
    description:
      "Graduated with 1st class distinction, specializing in digital electronics, computer networks, and VLSI design. Built a low-cost mop robot that won 3rd place in the SSIP Government Project.",
    highlights: [
      "Digital Electronics",
      "Computer Networks",
      "VLSI Design",
      "3rd place in SSIP Govt. Project",
    ],
    gradient: "from-[#af52de] to-[#bf5af2]",
    shadowColor: "rgba(175,82,222,0.35)",
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
      </svg>
    ),
  },
  {
    id: "bachelor",
    label: "B.E.",
    title: "Bachelor of Engineering in Electronics & Communication",
    tagline: "Jul 2021 – May 2024",
    role: "1st Class Distinction",
    description:
      "Graduated with 1st class distinction, specializing in digital electronics, computer networks, AI, and modern web development.",
    highlights: [
      "Digital Electronics",
      "Computer Networks",
      "Artificial Intelligence",
      "Modern Web Development",
    ],
    gradient: "from-[#ff9500] to-[#ff3b30]",
    shadowColor: "rgba(255,149,0,0.35)",
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </svg>
    ),
  },
];

interface ExperienceCardProps {
  heading: string;
  intro: string;
  entries: ExperienceEntry[];
  // Short highlights (education) sit in two columns; full sentences (jobs) read better in one
  twoColumnHighlights?: boolean;
}

// Same look as the "Find by App or Type" card: glossy app-icon tiles that swap the detail box below
function ExperienceCard({ heading, intro, entries, twoColumnHighlights = false }: ExperienceCardProps) {
  const [activeId, setActiveId] = useState(entries[0].id);
  const active = entries.find((e) => e.id === activeId) || entries[0];

  return (
    <div className="bg-[#f5f5f7] border border-zinc-200/70 rounded-[2rem] p-6 sm:p-8 lg:p-9 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      {/* Card Header */}
      <h3 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-zinc-900 text-center">
        {heading}
      </h3>
      <p className="text-sm sm:text-[0.875rem] text-zinc-500 leading-relaxed text-center max-w-md mx-auto mt-2 mb-5">
        {intro}
      </p>

      {/* Glossy Squircle Tiles */}
      <div className="flex justify-center items-start gap-5 sm:gap-6 mb-5">
        {entries.map((entry) => {
          const isSelected = entry.id === active.id;
          return (
            <button
              key={entry.id}
              type="button"
              onMouseEnter={() => setActiveId(entry.id)}
              onClick={() => setActiveId(entry.id)}
              aria-pressed={isSelected}
              title={entry.title}
              className="group flex flex-col items-center cursor-pointer"
            >
              <span
                className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${entry.gradient} flex items-center justify-center transition-all duration-300 shadow-md ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-black scale-110 -translate-y-1 shadow-lg"
                    : "opacity-85 group-hover:opacity-100 group-hover:scale-105 group-hover:-translate-y-0.5"
                }`}
                style={{
                  boxShadow: isSelected ? `0 10px 24px ${entry.shadowColor}` : undefined,
                }}
              >
                {/* Gloss highlight on top half like iOS App Icon */}
                <span className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent rounded-t-2xl pointer-events-none" />
                {entry.icon}
              </span>
              <span
                className={`text-[0.6875rem] sm:text-xs mt-2.5 transition-colors ${
                  isSelected
                    ? "font-semibold text-zinc-900"
                    : "font-medium text-zinc-500 group-hover:text-zinc-900"
                }`}
              >
                {entry.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Entry Detail Box */}
      <div
        key={active.id}
        className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] motion-safe:animate-fade-up"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5 mb-2">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug">
              {active.title}
            </h4>
            {active.role && (
              <p className="text-xs sm:text-[0.8125rem] font-semibold text-[#0071e3] mt-0.5">
                {active.role}
              </p>
            )}
          </div>
          <span className="text-[0.6875rem] font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            {active.tagline}
          </span>
        </div>

        <p className="text-xs sm:text-[0.8125rem] text-zinc-600 leading-relaxed mb-3">
          {active.description}
        </p>

        {/* Highlights */}
        <div
          className={`grid grid-cols-1 gap-2 pt-2 border-t border-zinc-100 ${
            twoColumnHighlights ? "sm:grid-cols-2" : ""
          }`}
        >
          {active.highlights.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <svg
                className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[0.6875rem] sm:text-xs text-zinc-600 font-medium leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative w-full py-20 sm:py-28 bg-white text-zinc-900 scroll-mt-20 border-t border-zinc-100"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Tagline */}
        <div className="text-center mb-7 sm:mb-9">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium tracking-wide uppercase mb-2.5">
            Career & Education
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
            Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <ExperienceCard
            heading="Professional Experience"
            intro="Hands-on industry experience shipping production web apps — from Vue.js interfaces to AI-powered MERN platforms and leading a development team."
            entries={PROFESSIONAL}
          />
          <ExperienceCard
            heading="Educational Details"
            intro="A strong engineering foundation in electronics & communication, graduating with 1st class distinction at both diploma and degree level."
            entries={EDUCATION}
            twoColumnHighlights
          />
        </div>
      </div>
    </section>
  );
}
