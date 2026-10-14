"use client";

import React, { useState, useEffect, useRef } from "react";

interface SkillItem {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "tools";
  level: string;
  icon: React.ReactNode;
}

interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  examples: string[];
  gradient: string;
  shadowColor: string;
  icon: React.ReactNode;
}

interface AnimatedMetricProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  isVisible: boolean;
  className?: string;
  duration?: number;
}

function AnimatedMetric({
  value,
  suffix = "",
  prefix = "",
  label,
  isVisible,
  className = "",
  duration = 1800,
}: AnimatedMetricProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    if (isVisible) {
      setDisplayValue(0);

      // Smooth ease-out curve (quartic)
      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

      const updateCounter = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentVal = Math.round(easedProgress * value);

        setDisplayValue(currentVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCounter);
        } else {
          setDisplayValue(value);
        }
      };

      animationFrameId = requestAnimationFrame(updateCounter);
    } else {
      // Reset when scrolled out of view so it auto-counts every time it enters view
      setDisplayValue(0);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, value, duration]);

  return (
    <div className={`flex flex-col items-center justify-center text-center px-4 py-1 ${className}`}>
      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 tabular-nums select-none transition-transform duration-200">
        {prefix}
        {displayValue}
        {suffix}
      </span>
      <span className="text-xs sm:text-[0.8125rem] font-medium text-zinc-500 mt-1">
        {label}
      </span>
    </div>
  );
}

export default function SkillsServices() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [activeServiceId, setActiveServiceId] = useState<string>("production");

  // Swipe state for the service detail card (touch devices)
  const serviceSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const serviceSwipeAxisRef = useRef<"x" | "y" | null>(null);
  const [serviceSwipe, setServiceSwipe] = useState({ offset: 0, settling: false });
  const [serviceSlideFrom, setServiceSlideFrom] = useState<"left" | "right" | null>(null);

  // Metrics observer to trigger counting animation every time the section enters viewport
  const metricsRef = useRef<HTMLDivElement>(null);
  const [isMetricsVisible, setIsMetricsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Triggers every time the element enters or exits the viewport
        setIsMetricsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2, // Trigger when 20% of the metrics container is visible
      }
    );

    const el = metricsRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  // Scrolling-based in & out animation for Left Part and Right Part
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollState, setScrollState] = useState({
    leftTranslateX: 0,
    rightTranslateX: 0,
    opacity: 1,
  });

  useEffect(() => {
    let animFrame: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Distance to slide in/out (responsive)
      const maxDistance = window.innerWidth < 768 ? 90 : 160;

      // Entrance thresholds:
      // Starts entering as soon as section top hits window bottom (rect.top <= windowH)
      // Fully settled when rect.top <= windowH * 0.40
      const enterStart = windowH;
      const enterEnd = windowH * 0.4;

      // Exit thresholds:
      // Starts exiting when section bottom passes windowH * 0.55
      // Fully exited when section bottom scrolls past top of viewport (rect.bottom <= 0)
      const exitStart = windowH * 0.55;
      const exitEnd = 0;

      let progress = 1;

      if (rect.top > enterStart) {
        // Below viewport
        progress = 0;
      } else if (rect.top > enterEnd) {
        // Entering from bottom: progress goes 0 -> 1
        progress = (enterStart - rect.top) / (enterStart - enterEnd);
      } else if (rect.bottom < exitEnd) {
        // Scrolled completely past top of viewport
        progress = 0;
      } else if (rect.bottom < exitStart) {
        // Exiting past top: progress goes 1 -> 0
        progress = (rect.bottom - exitEnd) / (exitStart - exitEnd);
      } else {
        // Fully in reading view
        progress = 1;
      }

      const clamped = Math.max(0, Math.min(1, progress));
      const offset = (1 - clamped) * maxDistance;
      const opacity = Math.max(0, Math.min(1, clamped * 1.25));

      setScrollState({
        leftTranslateX: -offset,
        rightTranslateX: offset,
        opacity,
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const SKILLS: SkillItem[] = [
    {
      id: "nextjs",
      name: "Next.js",
      category: "frontend",
      level: "Production Expert • SSR / App Router",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="90" r="90" fill="black" />
          <path
            d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.136 149.508 157.438Z"
            fill="url(#next_paint0)"
          />
          <rect x="115" y="54" width="12" height="72" fill="url(#next_paint1)" />
          <defs>
            <linearGradient
              id="next_paint0"
              x1="109"
              y1="116.5"
              x2="144.5"
              y2="160.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="next_paint1"
              x1="121"
              y1="54"
              x2="120.799"
              y2="106.875"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      id: "react",
      name: "React.js",
      category: "frontend",
      level: "Production Core • Hooks & Context",
      icon: (
        <svg className="w-7 h-7 text-[#149eca]" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
          <circle cx="0" cy="0" r="2.05" fill="#149eca" />
          <g stroke="#149eca" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      ),
    },
    {
      id: "vuejs",
      name: "Vue.js",
      category: "frontend",
      level: "Modern Framework • Composition API",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 261.76 226.69">
          <path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41b883" />
          <path d="M161.096.001l-30.225 52.351L100.647.001H52.246l78.626 136.181L209.502.001z" fill="#34495e" />
        </svg>
      ),
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "frontend",
      level: "Type-Safe Architecture",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 128 128">
          <path fill="#3178C6" d="M0 0h128v128H0z" />
          <path
            fill="#FFF"
            d="M62.6 74.3c-2.3 4.3-5.8 7.3-10.4 9.1-4.7 1.8-9.9 2.1-15.5 1-4.5-.9-8.4-2.8-11.7-5.9-3.3-3.1-5.4-7.2-6.2-12.3l12.4-2.3c.6 3.1 1.9 5.5 3.9 7.2 2 1.7 4.5 2.5 7.6 2.5 3.1 0 5.4-.7 7-2 1.6-1.3 2.4-3.1 2.4-5.3 0-1.8-.7-3.3-2-4.5-1.3-1.2-3.8-2.4-7.4-3.6-5.8-1.9-10-4-12.7-6.2-2.7-2.2-4.1-5.4-4.1-9.5 0-4.3 1.7-7.8 5.1-10.7 3.4-2.8 8.1-4.3 14.1-4.3 5.4 0 9.8 1.3 13.3 3.9 3.5 2.6 5.6 6.3 6.4 11.2l-12.2 2.1c-.5-2.6-1.6-4.5-3.3-5.7-1.7-1.2-3.8-1.8-6.4-1.8-2.6 0-4.6.6-6 1.7-1.4 1.1-2.1 2.6-2.1 4.4 0 1.6.6 2.9 1.8 4 1.2 1.1 3.5 2.1 6.9 3.2 6 2 10.4 4.2 13.1 6.6 2.7 2.4 4.1 5.8 4.1 10.3-.1 3.8-1.4 7-3.9 9.6zM88.9 31.9v52.6H76.7V31.9H59.4V21.4h46.7v10.5H88.9z"
          />
        </svg>
      ),
    },
    {
      id: "tailwind",
      name: "Tailwind CSS",
      category: "frontend",
      level: "Modern Utility UI & Responsive",
      icon: (
        <svg className="w-7 h-7 text-[#38bdf8]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      ),
    },
    {
      id: "nodejs",
      name: "Node.js",
      category: "backend",
      level: "High-Throughput REST & Microservices",
      icon: (
        <svg className="w-7 h-7 text-[#539e43]" viewBox="0 0 256 289" fill="currentColor">
          <path d="M128 0L0 74v141l128 74 128-74V74L128 0zm0 25.5l105.8 61.1v115.8L128 263.5 22.2 202.4V86.6L128 25.5z" />
          <path d="M116.8 77.3c-2.3 0-4.6.6-6.6 1.7l-41.5 24c-4.1 2.4-6.6 6.7-6.6 11.5v48c0 4.7 2.5 9.1 6.6 11.5l41.5 24c2 1.2 4.3 1.7 6.6 1.7s4.6-.6 6.6-1.7l41.5-24c4.1-2.4 6.6-6.7 6.6-11.5v-48c0-4.7-2.5-9.1-6.6-11.5l-41.5-24c-2-1.1-4.3-1.7-6.6-1.7zm0 21.6l30.8 17.8-30.8 17.8-30.8-17.8 30.8-17.8z" />
        </svg>
      ),
    },
    {
      id: "mongodb",
      name: "MongoDB",
      category: "database",
      level: "NoSQL Schemas & Aggregations",
      icon: (
        <svg className="w-7 h-7 text-[#00ed64]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.996 0a9.23 9.23 0 00-.73.045c-.21.015-.436.06-.675.105C9.704.345 6.84 1.785 5.564 4.545c-.9 1.95-1.185 4.545-.585 7.425.645 3.09 2.22 6.075 4.71 8.895 1.05 1.185 2.115 2.25 2.175 2.31.06.06.12.12.135.12.015 0 .075-.06.135-.12.06-.06 1.125-1.125 2.175-2.31 2.49-2.82 4.065-5.805 4.71-8.895.6-2.88.315-5.475-.585-7.425-1.275-2.76-4.14-4.2-5.025-4.395-.24-.045-.465-.09-.675-.105A9.23 9.23 0 0011.996 0zm.015 1.545c.42.06 2.37.45 3.51 2.295.735 1.185 1.05 2.76.915 4.575-.135 1.83-.825 3.915-1.92 6.09-.915 1.83-2.07 3.525-2.505 4.155V1.545zm-1.005 0v17.115c-.435-.63-1.59-2.325-2.505-4.155-1.095-2.175-1.785-4.26-1.92-6.09-.135-1.815.18-3.39.915-4.575 1.14-1.845 3.09-2.235 3.51-2.295z" />
        </svg>
      ),
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      category: "database",
      level: "Relational Modeling & Prisma / Drizzle",
      icon: (
        <svg className="w-7 h-7 text-[#336791]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
    },
    {
      id: "restapis",
      name: "REST APIs",
      category: "backend",
      level: "Secure Endpoints, JWT & Webhooks",
      icon: (
        <svg className="w-7 h-7 text-[#9333ea]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4" />
        </svg>
      ),
    },
    {
      id: "postman",
      name: "Postman",
      category: "tools",
      level: "API Testing, Mocking & Documentation",
      icon: (
        <svg className="w-7 h-7 text-[#ff6c37]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10 5.524 0 10-4.476 10-10 0-5.523-4.476-10-10-10zm2.84 5.32c.792 0 1.433.642 1.433 1.434 0 .791-.641 1.433-1.433 1.433-.792 0-1.434-.642-1.434-1.433 0-.792.642-1.434 1.434-1.434zm-5.68 0c.792 0 1.434.642 1.434 1.434 0 .791-.642 1.433-1.434 1.433-.791 0-1.433-.642-1.433-1.433 0-.792.642-1.434 1.433-1.434zm7.387 8.354c-.655 1.547-2.186 2.633-3.978 2.633-1.791 0-3.323-1.086-3.978-2.633-.14-.33.023-.71.36-.842.333-.134.71.025.842.358.468 1.106 1.564 1.883 2.776 1.883 1.213 0 2.308-.777 2.776-1.883.132-.333.51-.492.842-.358.337.132.5.512.36.842z" />
        </svg>
      ),
    },
  ];

  const SERVICES: ServiceItem[] = [
    {
      id: "production",
      title: "Full-Stack Production Builds",
      tagline: "From concept to scalable deployment",
      description:
        "Building full-featured production web applications from scratch with resilient architecture, clean modular code, responsive interfaces, and secure backend APIs.",
      examples: [
        "E-commerce platforms with payment integrations",
        "High-converting agency & marketing websites",
        "Interactive real estate listing portals",
        "Custom SaaS applications & bespoke portfolios",
      ],
      gradient: "from-[#0071e3] to-[#147efb]",
      shadowColor: "rgba(0,113,227,0.35)",
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: "backlog",
      title: "Backlog & Legacy Handling",
      tagline: "Unblocking features & refactoring stale code",
      description:
        "Specialized in stepping into existing codebases, taking over pending sprint tasks, resolving technical debt, upgrading stale libraries, and driving deliveries across the finish line.",
      examples: [
        "Reviving halted or abandoned web projects",
        "Dependency updates (Node, React, Next.js migrations)",
        "Refactoring messy spaghetti code into modular patterns",
        "Clearing high-priority backlogs & roadmap features",
      ],
      gradient: "from-[#34c759] to-[#30b050]",
      shadowColor: "rgba(52,199,89,0.35)",
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: "redesign",
      title: "Redesign & Modernization",
      tagline: "Elevating visual aesthetics & loading speeds",
      description:
        "Transforming outdated websites into modern, sleek digital experiences with cutting-edge UI aesthetics, fluid micro-interactions, responsive mobile layouts, and search-optimized structure.",
      examples: [
        "Complete modern UI/UX redesigns",
        "100% responsive cross-device mobile layouts",
        "Core Web Vitals & Google Lighthouse score improvements",
        "Technical SEO optimization for organic search rankings",
      ],
      gradient: "from-[#af52de] to-[#bf5af2]",
      shadowColor: "rgba(175,82,222,0.35)",
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24" />
          <path d="m14.83 9.17 4.24-4.24" />
          <path d="m14.83 14.83 4.24 4.24" />
          <path d="m9.17 14.83-4.24 4.24" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
    },
    {
      id: "debugging",
      title: "Bug Solving & Optimization",
      tagline: "Deep troubleshooting & bottleneck eradication",
      description:
        "Tackling tricky bugs, race conditions, memory leaks, security vulnerabilities, and deployment failures so your application runs smoothly, safely, and without downtime.",
      examples: [
        "Debugging elusive frontend and backend runtime errors",
        "Eliminating database query bottlenecks & latency spikes",
        "Hardening API security, auth flows, and headers",
        "Resolving broken CI/CD pipelines & deployment configurations",
      ],
      gradient: "from-[#ff9500] to-[#ff3b30]",
      shadowColor: "rgba(255,149,0,0.35)",
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
  ];

  const filteredSkills =
    activeCategory === "all"
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory);

  const selectedService =
    SERVICES.find((s) => s.id === activeServiceId) || SERVICES[0];

  // Picking a tile swaps the card in place; swiping slides the next card in from the swipe side
  const selectService = (id: string) => {
    setServiceSlideFrom(null);
    setActiveServiceId(id);
  };

  const showAdjacentService = (step: 1 | -1) => {
    const idx = SERVICES.findIndex((s) => s.id === selectedService.id);
    setServiceSlideFrom(step === 1 ? "right" : "left");
    setActiveServiceId(SERVICES[(idx + step + SERVICES.length) % SERVICES.length].id);
  };

  // Touch swipe on the service detail card: left = next service, right = previous
  const handleServiceTouchStart = (e: React.TouchEvent) => {
    serviceSwipeStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    serviceSwipeAxisRef.current = null;
  };

  const handleServiceTouchMove = (e: React.TouchEvent) => {
    const start = serviceSwipeStartRef.current;
    if (!start) return;
    const dx = e.touches[0].clientX - start.x;
    const dy = e.touches[0].clientY - start.y;

    // Lock to one axis after a small movement so vertical page scrolling is never hijacked
    if (!serviceSwipeAxisRef.current && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      serviceSwipeAxisRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (serviceSwipeAxisRef.current === "x") {
      setServiceSwipe({ offset: dx, settling: false });
    }
  };

  const handleServiceTouchEnd = (e: React.TouchEvent) => {
    const start = serviceSwipeStartRef.current;
    serviceSwipeStartRef.current = null;
    if (!start || serviceSwipeAxisRef.current !== "x") return;

    const dx = e.changedTouches[0].clientX - start.x;
    if (Math.abs(dx) > 50) {
      // Snap the drag offset away instantly; the new card's slide-in animation takes over
      setServiceSwipe({ offset: 0, settling: false });
      showAdjacentService(dx < 0 ? 1 : -1);
    } else {
      // Too short: ease the card back into place
      setServiceSwipe({ offset: 0, settling: true });
    }
  };

  const handleServiceTouchCancel = () => {
    serviceSwipeStartRef.current = null;
    setServiceSwipe({ offset: 0, settling: true });
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full pt-4 sm:pt-6 pb-14 sm:pb-20 bg-white text-zinc-900 scroll-mt-20 overflow-x-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Tagline */}
        <div className="text-center mb-7 sm:mb-9">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium tracking-wide uppercase mb-2.5">
            Technical Stack & Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
            Skills & Capabilities
          </h2>
        </div>

        {/* 2-Column Bento Grid Matching Reference Image Aesthetic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          {/* ========================================================= */}
          {/* CARD 1: SKILLS & TECHNOLOGIES (Custom Categories Style)   */}
          {/* ========================================================= */}
          <div
            style={{
              transform: `translateX(${scrollState.leftTranslateX}px)`,
              opacity: scrollState.opacity,
            }}
            className="bg-[#f5f5f7] border border-zinc-200/70 rounded-[2rem] p-6 sm:p-8 lg:p-9 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-[transform,opacity,box-shadow] duration-300 ease-out will-change-transform"
          >
            <div>
              {/* Card Header */}
              <h3 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-zinc-900 text-center">
                Custom Categories
              </h3>
              <p className="text-sm sm:text-[0.875rem] text-zinc-500 leading-relaxed text-center max-w-md mx-auto mt-2 mb-5">
                Battle-tested frameworks, robust backend runtimes, and databases I use to architect scalable, high-converting web applications.
              </p>

              {/* Reference-Style Pill Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-full text-xs sm:text-[0.8125rem] font-semibold transition-all duration-200 ${
                    activeCategory === "all"
                      ? "bg-[#0071e3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.35)] scale-105"
                      : "bg-zinc-200/80 text-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  All Stack 10
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("frontend")}
                  className={`px-4 py-2 rounded-full text-xs sm:text-[0.8125rem] font-medium transition-all duration-200 ${
                    activeCategory === "frontend"
                      ? "bg-[#0071e3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.35)] scale-105 font-semibold"
                      : "bg-zinc-200/80 text-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  Frontend 5
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("backend")}
                  className={`px-4 py-2 rounded-full text-xs sm:text-[0.8125rem] font-medium transition-all duration-200 ${
                    activeCategory === "backend"
                      ? "bg-[#0071e3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.35)] scale-105 font-semibold"
                      : "bg-zinc-200/80 text-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  Backend 2
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("database")}
                  className={`px-4 py-2 rounded-full text-xs sm:text-[0.8125rem] font-medium transition-all duration-200 ${
                    activeCategory === "database"
                      ? "bg-[#0071e3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.35)] scale-105 font-semibold"
                      : "bg-zinc-200/80 text-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  Databases 2
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("tools")}
                  className={`px-4 py-2 rounded-full text-xs sm:text-[0.8125rem] font-medium transition-all duration-200 ${
                    activeCategory === "tools"
                      ? "bg-[#0071e3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.35)] scale-105 font-semibold"
                      : "bg-zinc-200/80 text-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  Tools 1
                </button>
                {/* Round Plus Pill Button matching reference image */}
                <span
                  title="Constantly expanding stack"
                  className="w-8 h-8 rounded-full bg-zinc-200/80 text-zinc-600 flex items-center justify-center font-bold text-sm select-none cursor-default hover:bg-zinc-300 transition-colors"
                >
                  +
                </span>
              </div>

              {/* Squircles / App Icon Tiles Grid (Interactive Hover & Details) */}
              <div className="grid grid-cols-5 gap-3.5 sm:gap-4 max-w-md mx-auto mb-4">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill.id}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className="group relative flex flex-col items-center"
                  >
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-[0_3px_10px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-black/[0.04] flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:scale-115 group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
                      {skill.icon}
                    </div>
                    <span className="text-[0.6875rem] sm:text-xs font-medium text-zinc-600 mt-2 truncate max-w-full text-center group-hover:text-zinc-950 transition-colors">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Tooltip Card at the Bottom of Left Card */}
            <div className="mt-4 pt-3 border-t border-zinc-200/80 flex items-center justify-between min-h-11.5">
              {hoveredSkill ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center p-1">
                    {hoveredSkill.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      {hoveredSkill.name}
                    </span>
                    <span className="text-[0.6875rem] text-zinc-500 font-medium">
                      {hoveredSkill.level}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-zinc-400 font-normal">
                  Hover over any technology icon to inspect details
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[0.6875rem] font-semibold text-zinc-600 shadow-sm border border-zinc-200/60 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                2.5+ Yrs Exp
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 2: SERVICES & SOLUTIONS (Find by App or Type Style)   */}
          {/* ========================================================= */}
          <div
            style={{
              transform: `translateX(${scrollState.rightTranslateX}px)`,
              opacity: scrollState.opacity,
            }}
            className="bg-[#f5f5f7] border border-zinc-200/70 rounded-[2rem] p-6 sm:p-8 lg:p-9 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-[transform,opacity,box-shadow] duration-300 ease-out will-change-transform"
          >
            <div>
              {/* Card Header */}
              <h3 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-zinc-900 text-center">
                Find by App or Type
              </h3>
              <p className="text-sm sm:text-[0.875rem] text-zinc-500 leading-relaxed text-center max-w-md mx-auto mt-2 mb-5">
                Comprehensive engineering capabilities tailored for businesses — from initial architecture to reviving legacy code and deep debugging.
              </p>

              {/* Row 1: Glossy Colorful Squircle App Tiles (Matching Reference Image) */}
              <div className="flex justify-center items-center gap-3 sm:gap-4 mb-5">
                {SERVICES.map((service) => {
                  const isSelected = activeServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onMouseEnter={() => selectService(service.id)}
                      onClick={() => selectService(service.id)}
                      className={`group relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-black scale-110 -translate-y-1 shadow-lg"
                          : "opacity-85 hover:opacity-100 hover:scale-105 hover:-translate-y-0.5"
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? `0 10px 24px ${service.shadowColor}`
                          : undefined,
                      }}
                      title={service.title}
                    >
                      {/* Gloss highlight on top half like iOS App Icon */}
                      <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent rounded-t-2xl pointer-events-none" />
                      {service.icon}
                    </button>
                  );
                })}
              </div>

              {/* Service Active Detail Box (swipe left / right for next / previous on touch screens) */}
              <div
                onTouchStart={handleServiceTouchStart}
                onTouchMove={handleServiceTouchMove}
                onTouchEnd={handleServiceTouchEnd}
                onTouchCancel={handleServiceTouchCancel}
                style={{
                  transform: serviceSwipe.offset ? `translateX(${serviceSwipe.offset}px)` : undefined,
                  opacity: 1 - Math.min(Math.abs(serviceSwipe.offset) / 300, 0.5),
                }}
                className={`touch-pan-y ${
                  serviceSwipe.settling ? "transition-[transform,opacity] duration-300 ease-out" : ""
                }`}
              >
                <div
                  key={selectedService.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
                    serviceSlideFrom === "right"
                      ? "motion-safe:animate-slide-in-right"
                      : serviceSlideFrom === "left"
                        ? "motion-safe:animate-slide-in-left"
                        : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base sm:text-lg font-bold text-zinc-900">
                      {selectedService.title}
                    </h4>
                    <span className="text-[0.6875rem] font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                      {selectedService.tagline}
                    </span>
                  </div>

                  <p className="text-xs sm:text-[0.8125rem] text-zinc-600 leading-relaxed mb-3">
                    {selectedService.description}
                  </p>

                  {/* Key Deliverables Bullet Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
                    {selectedService.examples.map((ex, idx) => (
                      <div key={idx} className="flex items-start gap-2">
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
                        <span className="text-[0.6875rem] sm:text-xs text-zinc-600 font-medium">
                          {ex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Swipe hint dots (touch-sized screens only) */}
              <div className="lg:hidden flex items-center justify-center gap-1.5 mt-3">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => selectService(service.id)}
                    aria-label={`Show ${service.title}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      service.id === selectedService.id ? "w-6 bg-zinc-900" : "w-1.5 bg-zinc-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Contact Toolbar */}
            <div className="mt-3 pt-3 border-t border-zinc-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-700">
                  Ready to start a project?
                </span>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-xs font-semibold shadow-sm hover:bg-zinc-800 transition-all active:scale-95"
              >
                <span>Hire / Inquire</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* SEPARATE HORIZONTAL METRICS CONTAINER                      */}
        {/* ========================================================= */}
        <div
          ref={metricsRef}
          className="mt-12 md:mt-10 w-full bg-[#f5f5f7] border border-zinc-200/70 rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-zinc-200/80">
            {/* Metric 1: 20+ Completed Projects */}
            <AnimatedMetric
              value={20}
              suffix="+"
              label="Completed Projects"
              isVisible={isMetricsVisible}
              duration={1600}
            />

            {/* Metric 2: 99% Client Satisfaction */}
            <AnimatedMetric
              value={99}
              suffix="%"
              label="Client Satisfaction"
              isVisible={isMetricsVisible}
              className="pt-4 md:pt-1"
              duration={1900}
            />

            {/* Metric 3: 5x Average Web App Speedup */}
            <AnimatedMetric
              value={5}
              suffix="x"
              label="Average Web App Speedup"
              isVisible={isMetricsVisible}
              className="pt-4 md:pt-1"
              duration={1400}
            />

            {/* Metric 4: 24/7 Technical Support */}
            <AnimatedMetric
              value={24}
              suffix="/7"
              label="Technical Support"
              isVisible={isMetricsVisible}
              className="pt-4 md:pt-1"
              duration={1700}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
