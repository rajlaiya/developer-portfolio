"use client";

import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const maxChars = 250;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > maxChars) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        countryCode: "+91",
        phone: "",
        email: "",
        service: "",
        budget: "",
        message: "",
      });
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
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-zinc-900 leading-[1.15] mb-4">
                Have a Project in Mind?
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-md mb-10">
                We provide the high-performance engineering required to move your product from a roadmap to reality. I’m always open to collaborations and creative challenges.
              </p>

              {/* Trusted By Section */}
              <div className="mb-10">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-4">
                  Trusted By Founders & Teams
                </span>
                <div className="grid grid-cols-4 gap-3 sm:gap-4 opacity-70">
                  {/* Subtle Monochrome Tech & Client Logos */}
                  <div className="h-11 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-center p-2">
                    <span className="text-xs font-bold tracking-wider text-zinc-700">NEXT.JS</span>
                  </div>
                  <div className="h-11 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-center p-2">
                    <span className="text-xs font-bold tracking-wider text-zinc-700">VERCEL</span>
                  </div>
                  <div className="h-11 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-center p-2">
                    <span className="text-xs font-bold tracking-wider text-zinc-700">STRIPE</span>
                  </div>
                  <div className="h-11 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-center p-2">
                    <span className="text-xs font-bold tracking-wider text-zinc-700">SUPABASE</span>
                  </div>
                </div>
              </div>

              {/* Proof Rating */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                  4.9
                </span>
                <div className="flex items-center text-amber-400 text-sm gap-0.5">
                  {"★".repeat(5)}
                </div>
                <span className="text-xs sm:text-[13px] font-medium text-zinc-500 border-l border-zinc-200 pl-3">
                  20+ projects delivered
                </span>
              </div>
            </div>

            {/* Direct Contact Pill */}
            <div className="mt-10 pt-6 border-t border-zinc-100 hidden lg:flex items-center gap-4">
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

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Architectural Grid Contact Form              */}
          {/* ========================================================= */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="w-full">
              {/* Grid Form Container matching Reference Design */}
              <div className="bg-[#f2f2f5] border border-zinc-300 divide-y divide-zinc-300 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                
                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-300">
                  {/* Name Field */}
                  <div className="p-4 sm:p-5">
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
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="p-4 sm:p-5">
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
                        className="bg-transparent text-sm font-semibold text-zinc-800 focus:outline-none cursor-pointer border-r border-zinc-300 pr-2"
                        aria-label="Country Code"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+971">+971</option>
                        <option value="+61">+61</option>
                      </select>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="63557 05208"
                        className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email & Select Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-300">
                  {/* Email Field */}
                  <div className="p-4 sm:p-5">
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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none"
                    />
                  </div>

                  {/* Service Dropdown Field */}
                  <div className="p-4 sm:p-5">
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
                      className="w-full bg-transparent text-sm text-zinc-900 font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Choose a service...
                      </option>
                      <option value="Website Development">Website Development</option>
                      <option value="Web App / SaaS Development">Web App / SaaS Development</option>
                      <option value="E-Commerce Development">E-Commerce Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Budget Field */}
                <div className="p-4 sm:p-5">
                  <label
                    htmlFor="budget"
                    className="block text-xs font-medium text-zinc-700 mb-1.5"
                  >
                    * Project Budget
                  </label>
                  <input
                    id="budget"
                    name="budget"
                    type="text"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="$2000 - $5000"
                    className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none"
                  />
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
                    maxLength={maxChars}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project scope, timeline, or objectives..."
                    className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium resize-none focus:outline-none"
                  />
                  {/* Live Character Counter */}
                  <div className="flex justify-between items-center text-[11px] text-zinc-500 pt-2 border-t border-zinc-200/60 mt-2">
                    <span>
                      {formData.message.length} of {maxChars} max characters
                    </span>
                    {formData.message.length === maxChars && (
                      <span className="text-amber-600 font-medium">Character limit reached</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Action Button */}
              <div className="mt-5 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={submitted}
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#0066ff] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_6px_20px_rgba(0,102,255,0.32)] hover:bg-blue-700 hover:shadow-[0_8px_25px_rgba(0,102,255,0.42)] active:scale-95 transition-all duration-200"
                >
                  <span>{submitted ? "Message Received!" : "Book a Free Strategy Call"}</span>
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
                </button>

                {submitted && (
                  <span className="text-xs font-semibold text-emerald-600 animate-fadeIn">
                    ✓ Thank you! Raj will connect with you shortly.
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
