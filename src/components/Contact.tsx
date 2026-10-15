"use client";

import React, { useEffect, useState } from "react";
import {
  CURRENCIES,
  LOCATIONS,
  MESSAGE_MAX,
  OTHER_LOCATION,
  PHONE_CODES,
  SERVICES,
  formatLocation,
  validateContact,
  type ContactErrorField,
  type ContactForm,
} from "@/lib/contact";

const LOCATION_CODES = new Set(LOCATIONS.map((l) => l.code));

// Order the fields appear in, so a failed submit focuses the first invalid one
const ERROR_FIELD_ORDER: ContactErrorField[] = ["name", "phone", "email", "service", "location", "budget", "message"];

// Location sources tried in order; each responds with { country: "IN" }
const LOCATION_SOURCES = [
  "/api/location", // geo header from our own host (Vercel / Cloudflare)
  "https://get.geojs.io/v1/ip/country.json", // IP lookup fallback, e.g. local dev or other hosts
];

// Visitor's country code from their IP, or null if no source could tell
async function detectCountry(): Promise<string | null> {
  for (const url of LOCATION_SOURCES) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const { country } = await res.json();
      if (typeof country === "string" && /^[A-Z]{2}$/.test(country)) return country;
    } catch {
      // Network error, timeout or blocked by an ad blocker: try the next source
    }
  }
  return null;
}

const EMPTY_FORM: ContactForm = {
  name: "",
  countryCode: "+91",
  phone: "",
  email: "",
  location: "",
  service: "",
  currency: "INR",
  budget: "",
  message: "",
};

// Field cell; turns light red while its value is invalid
const cellClass = (error?: string) =>
  `p-4 sm:p-5 transition-colors ${error ? "bg-red-50" : ""}`;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[0.6875rem] font-medium text-red-600">
      {message}
    </p>
  );
}

// Shared style for the blue pill CTAs ("Book a Free Strategy Call" and the form submit)
const CTA_BUTTON_CLASS =
  "group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#0066ff] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_6px_20px_rgba(0,102,255,0.32)] hover:bg-blue-700 hover:shadow-[0_8px_25px_rgba(0,102,255,0.42)] active:scale-95 transition-all duration-200";

function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Auto-detected location option: undefined while detecting, "" if detection failed
  const [detectedLocation, setDetectedLocation] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    detectCountry().then((code) => {
      if (cancelled) return;
      const location = !code ? "" : LOCATION_CODES.has(code) ? code : OTHER_LOCATION;
      setDetectedLocation(location);
      // Don't overwrite a location the visitor already picked
      if (location) setFormData((prev) => (prev.location ? prev : { ...prev, location }));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const budgetCurrency =
    CURRENCIES.find((c) => c.code === formData.currency) || CURRENCIES[0];

  const phoneCode = PHONE_CODES.find((p) => p.code === formData.countryCode) || PHONE_CODES[0];

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Errors are recalculated on every change, but a field only shows its error once the visitor
  // has left it, or after they tried to submit; from then on it updates live as they fix it
  const errors = validateContact(formData);
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const errorFor = (field: ContactErrorField) =>
    showAllErrors || touched[field] ? errors[field] : undefined;

  // Props that link an input to its error message for screen readers
  const errorProps = (field: ContactErrorField) => ({
    "aria-invalid": Boolean(errorFor(field)),
    "aria-describedby": errorFor(field) ? `${field}-error` : undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === "message" && value.length > MESSAGE_MAX) {
      return;
    }
    // Phone accepts digits, spaces and dashes only
    if (name === "phone") value = value.replace(/[^\d\s-]/g, "");
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") setStatus("idle");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // The country code select belongs to the phone field
    const field = e.target.name === "countryCode" ? "phone" : e.target.name;
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  // Saves the enquiry to the Google Sheet via /api/contact (which adds the IP; the sheet adds the timestamp)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const firstInvalid = ERROR_FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      setShowAllErrors(true);
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.ok) throw new Error(result?.error);
    } catch {
      setStatus("error");
      return;
    }

    setStatus("sent");
    setTimeout(() => {
      setStatus("idle");
      setFormData({ ...EMPTY_FORM, location: detectedLocation ?? "" });
      setTouched({});
      setShowAllErrors(false);
    }, 4000);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-20 sm:py-28 bg-white text-zinc-900 scroll-mt-20 border-t border-zinc-100"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Headline, Value Proposition & Trust Badges   */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-zinc-900 leading-[1.15] mb-4">
                Have a Project in Mind?
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-md mb-8">
                We provide the high-performance engineering required to move your product from a roadmap to reality. I’m always open to collaborations and creative challenges.
              </p>

              {/* Proof Rating */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                  4.9
                </span>
                <div className="flex items-center text-amber-400 text-sm gap-0.5">
                  {"★".repeat(5)}
                </div>
                <span className="text-xs sm:text-[0.8125rem] font-medium text-zinc-500 border-l border-zinc-200 pl-3">
                  20+ projects delivered
                </span>
              </div>
            </div>

            <div className="mt-10">
              {/* Strategy Call CTA */}
              <a
                href="mailto:rajlaiya2017@gmail.com?subject=Free%20Strategy%20Call"
                className={CTA_BUTTON_CLASS}
              >
                <span>Book a Free Strategy Call</span>
                <ArrowIcon />
              </a>

              {/* Direct Contact Pill */}
              <div className="mt-6 pt-6 border-t border-zinc-100 hidden lg:flex items-center gap-4">
                <a
                  href="mailto:rajlaiya2017@gmail.com"
                  className="text-xs font-medium text-zinc-500 hover:text-black transition-colors"
                >
                  rajlaiya2017@gmail.com
                </a>
                <span className="text-zinc-300">•</span>
                <a
                  href="tel:+916355705208"
                  className="text-xs font-medium text-zinc-500 hover:text-black transition-colors"
                >
                  +91 6355705208
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Architectural Grid Contact Form              */}
          {/* ========================================================= */}
          <div className="lg:col-span-7">
            {/* noValidate: our own checks and messages replace the browser's validation bubbles */}
            <form onSubmit={handleSubmit} noValidate className="w-full">
              {/* Grid Form Container matching Reference Design */}
              <div className="bg-[#f2f2f5] border border-zinc-300 divide-y divide-zinc-300 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-300">
                  {/* Name Field */}
                  <div className={cellClass(errorFor("name"))}>
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-zinc-700 mb-1.5"
                    >
                      * Enter your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      maxLength={60}
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...errorProps("name")}
                      placeholder="e.g. Alex Morgan"
                      className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none"
                    />
                    <FieldError id="name-error" message={errorFor("name")} />
                  </div>

                  {/* Phone Field (digits checked against the selected country code) */}
                  <div className={cellClass(errorFor("phone"))}>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-medium text-zinc-700 mb-1.5"
                    >
                      * Enter your Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-transparent text-sm font-semibold text-zinc-800 focus:outline-none cursor-pointer border-r border-zinc-300 pr-2"
                        aria-label="Country Code"
                      >
                        {PHONE_CODES.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.code}
                          </option>
                        ))}
                      </select>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        required
                        maxLength={16}
                        autoComplete="tel-national"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        {...errorProps("phone")}
                        placeholder={phoneCode.example}
                        className="w-full min-w-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none"
                      />
                    </div>
                    <FieldError id="phone-error" message={errorFor("phone")} />
                  </div>
                </div>

                {/* Row 2: Email & Select Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-300">
                  {/* Email Field */}
                  <div className={cellClass(errorFor("email"))}>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-zinc-700 mb-1.5"
                    >
                      * Enter your Email ID
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...errorProps("email")}
                      placeholder="alex@company.com"
                      className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none"
                    />
                    <FieldError id="email-error" message={errorFor("email")} />
                  </div>

                  {/* Service Dropdown Field */}
                  <div className={cellClass(errorFor("service"))}>
                    <label
                      htmlFor="service"
                      className="block text-xs font-medium text-zinc-700 mb-1.5"
                    >
                      * Select Service
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...errorProps("service")}
                      className="w-full bg-transparent text-sm text-zinc-900 font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Choose a service...
                      </option>
                      {SERVICES.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    <FieldError id="service-error" message={errorFor("service")} />
                  </div>
                </div>

                {/* Row 3: Location & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-300">
                  {/* Location Field (auto-detected from IP, editable) */}
                  <div className={cellClass(errorFor("location"))}>
                    <label
                      htmlFor="location"
                      className="flex items-center justify-between gap-2 text-xs font-medium text-zinc-700 mb-1.5"
                    >
                      <span>* Your Location</span>
                      {detectedLocation && formData.location === detectedLocation && (
                        <span className="text-[0.6875rem] font-normal text-zinc-400">
                          Auto-detected
                        </span>
                      )}
                    </label>
                    <select
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...errorProps("location")}
                      className="w-full bg-transparent text-sm text-zinc-900 font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="" disabled>
                        {detectedLocation === undefined
                          ? "Detecting your location..."
                          : "Choose your country..."}
                      </option>
                      {LOCATIONS.map((l) => (
                        <option key={l.code} value={l.code}>
                          {formatLocation(l.code)}
                        </option>
                      ))}
                      <option value={OTHER_LOCATION}>Other</option>
                    </select>
                    <FieldError id="location-error" message={errorFor("location")} />
                  </div>

                  {/* Budget Field (currency selector + amount, like the phone field) */}
                  <div className={cellClass(errorFor("budget"))}>
                    <label
                      htmlFor="budget"
                      className="block text-xs font-medium text-zinc-700 mb-1.5"
                    >
                      * Project Budget
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="bg-transparent text-sm font-semibold text-zinc-800 focus:outline-none cursor-pointer border-r border-zinc-300 pr-2"
                        aria-label="Budget Currency"
                        title={`${budgetCurrency.country} (${budgetCurrency.code})`}
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        id="budget"
                        name="budget"
                        type="text"
                        required
                        maxLength={40}
                        value={formData.budget}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        {...errorProps("budget")}
                        placeholder={budgetCurrency.example}
                        className="w-full min-w-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none"
                      />
                    </div>
                    <FieldError id="budget-error" message={errorFor("budget")} />
                  </div>
                </div>

                {/* Row 4: Additional Project Details (250 chars max) */}
                <div className="p-4 sm:p-5">
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium text-zinc-700 mb-1.5"
                  >
                    Enter your Message / Additional Project Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={MESSAGE_MAX}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell me about your project scope, timeline, or objectives..."
                    className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium resize-none focus:outline-none"
                  />
                  {/* Live Character Counter */}
                  <div className="flex justify-between items-center text-[0.6875rem] text-zinc-500 pt-2 border-t border-zinc-200/60 mt-2">
                    <span>
                      {formData.message.length} of {MESSAGE_MAX} max characters
                    </span>
                    {formData.message.length === MESSAGE_MAX && (
                      <span className="text-amber-600 font-medium">Character limit reached</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Action Button */}
              <div className="mt-5 flex items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === "sending" || status === "sent"}
                  className={`${CTA_BUTTON_CLASS} disabled:cursor-default`}
                >
                  <span>
                    {status === "sending"
                      ? "Sending..."
                      : status === "sent"
                        ? "Message Received!"
                        : "Submit your enquiry"}
                  </span>
                  <ArrowIcon />
                </button>

                {status === "sent" && (
                  <span className="text-xs font-semibold text-emerald-600 animate-fadeIn">
                    ✓ Thank you! Raj will connect with you shortly.
                  </span>
                )}
                {status === "error" && (
                  <span role="alert" className="text-xs font-semibold text-red-600 text-right max-w-xs">
                    Couldn&apos;t send your enquiry. Please try again or email rajlaiya2017@gmail.com.
                  </span>
                )}
                {status === "idle" && showAllErrors && Object.keys(errors).length > 0 && (
                  <span role="alert" className="text-xs font-semibold text-red-600 text-right">
                    Please fix the highlighted fields.
                  </span>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
