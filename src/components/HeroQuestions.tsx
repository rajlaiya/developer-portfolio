"use client";

import React, { useEffect, useRef, useState } from "react";

// Questions the portrait "asks" the visitor, shown one at a time, alternating left / right
const QUESTIONS = [
  "Looking for a developer to build your e-commerce store?",
  "Need a developer for a custom CRM platform?",
  "Looking for a developer to craft your portfolio website?",
  "Need a developer for an informative catalog website?",
];

const HOVER_DELAY_MS = 200; // before the first question, so a cursor just passing over doesn't flash one
const FADE_MS = 500; // fade / pop in and out
const HOLD_MS = 2000; // fully visible
const INTERVAL_MS = 5000; // from one question appearing to the next

const TAIL_EM = 1.25; // tail height, relative to the bubble's font size

type Side = "left" | "right";

// Bubble placement relative to the portrait wrapper: above the head on stacked layouts,
// beside the head on lg+ (tail tip anchored, so the tail always points at the head)
const SIDE_CLASSES: Record<Side, string> = {
  left: "left-0 bottom-[calc(100%-2.25rem)] sm:left-[4%] lg:left-auto lg:right-[calc(100%-4.5rem)] lg:bottom-[83%] origin-[88%_100%]",
  right: "right-0 bottom-[calc(100%-2.25rem)] sm:right-[4%] lg:right-auto lg:left-[calc(100%-4.5rem)] lg:bottom-[83%] origin-[12%_100%]",
};

// Rounded speech-bubble outline for a w×h box whose bottom `tail` px hold the tail.
// The left bubble's tail sits bottom-right; the right bubble is mirrored so both point inward.
function bubblePath(w: number, h: number, tail: number, stroke: number, side: Side) {
  const x = (v: number) => (side === "left" ? v : w - v);
  const sweep = side === "left" ? 1 : 0;
  const i = stroke / 2;
  const top = i;
  const left = i;
  const right = w - i;
  const bottom = h - tail - i;
  const r = Math.min((bottom - top) / 2, tail * 2.2);
  const tailStart = right - r; // tail leaves the body where the bottom corner curve ends
  const tailEnd = tailStart - tail * 0.95;
  const tipX = tailStart + tail * 0.55; // points down and out, toward the portrait
  const tipY = h - i;

  return [
    `M ${x(left + r)} ${top}`,
    `H ${x(right - r)}`,
    `A ${r} ${r} 0 0 ${sweep} ${x(right)} ${top + r}`,
    `V ${bottom - r}`,
    `A ${r} ${r} 0 0 ${sweep} ${x(tailStart)} ${bottom}`,
    `Q ${x(tailStart + tail * 0.05)} ${bottom + tail * 0.5} ${x(tipX)} ${tipY}`,
    `Q ${x(tailEnd + (tipX - tailEnd) * 0.5)} ${bottom + tail * 0.3} ${x(tailEnd)} ${bottom}`,
    `H ${x(left + r)}`,
    `A ${r} ${r} 0 0 ${sweep} ${x(left)} ${bottom - r}`,
    `V ${top + r}`,
    `A ${r} ${r} 0 0 ${sweep} ${x(left + r)} ${top}`,
    "Z",
  ].join(" ");
}

function ChatBubble({ text, side, visible }: { text: string; side: Side; visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<{ w: number; h: number; stroke: number; d: string } | null>(null);

  // The outline is drawn to the bubble's measured size, so it fits any text length and font scale
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const stroke = Math.max(1.5, fontSize * 0.13);
      setShape({ w, h, stroke, d: bubblePath(w, h, fontSize * TAIL_EM, stroke, side) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [side]);

  // Opacity is set on each layer rather than the bubble itself: an ancestor with opacity < 1
  // would cut the backdrop blur off from the page behind it
  const fade = `transition-opacity ease-out ${visible ? "opacity-100" : "opacity-0"}`;
  const fadeStyle = { transitionDuration: `${FADE_MS}ms` };

  return (
    <div
      ref={ref}
      style={{
        paddingBottom: `calc(0.8em + ${TAIL_EM}em)`,
        transitionDuration: `${FADE_MS}ms`,
      }}
      className={`absolute z-20 w-[16em] lg:w-[18em] px-[1.15em] pt-[0.8em] text-[0.75rem] sm:text-[0.8125rem] lg:text-[0.875rem] xl:text-[0.9375rem] transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "scale-100 translate-y-0" : "scale-90 translate-y-1.5"
      } ${SIDE_CLASSES[side]}`}
    >
      {shape && (
        <>
          {/* Frosted-glass fill, clipped to the bubble outline (tail included) */}
          <div
            className={`absolute inset-0 bg-white/55 backdrop-blur-md ${fade}`}
            style={{ ...fadeStyle, clipPath: `path('${shape.d}')` }}
          />
          <svg
            className={`absolute inset-0 overflow-visible text-zinc-900/45 ${fade}`}
            style={fadeStyle}
            width={shape.w}
            height={shape.h}
            viewBox={`0 0 ${shape.w} ${shape.h}`}
          >
            <path
              d={shape.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={shape.stroke}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </>
      )}
      <p
        className={`relative text-center font-medium leading-snug tracking-tight text-zinc-900/65 ${fade}`}
        style={fadeStyle}
      >
        {text}
      </p>
    </div>
  );
}

// Runs only while `active` (the portrait is hovered); leaving hides the bubble and stops the loop.
// Each hover picks up with the next question, so repeat visitors see them all.
export default function HeroQuestions({ active }: { active: boolean }) {
  const [shown, setShown] = useState({ index: 0, visible: false });
  const nextIndex = useRef(0);

  // show (fade in + hold) -> hide (fade out) -> wait out the rest of the interval -> next question, looping
  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout>;

    const show = () => {
      const index = nextIndex.current;
      nextIndex.current = (index + 1) % QUESTIONS.length;
      setShown({ index, visible: true });
      timer = setTimeout(hide, FADE_MS + HOLD_MS);
    };
    const hide = () => {
      setShown((prev) => ({ ...prev, visible: false }));
      timer = setTimeout(show, INTERVAL_MS - FADE_MS - HOLD_MS);
    };

    timer = setTimeout(show, HOVER_DELAY_MS);
    return () => {
      clearTimeout(timer);
      setShown((prev) => ({ ...prev, visible: false }));
    };
  }, [active]);

  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {QUESTIONS.map((question, idx) => (
        <ChatBubble
          key={question}
          text={question}
          side={idx % 2 === 0 ? "left" : "right"}
          visible={shown.visible && shown.index === idx}
        />
      ))}
    </div>
  );
}
