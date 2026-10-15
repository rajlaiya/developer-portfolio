import { NextResponse } from "next/server";
import {
  CONTACT_FIELDS,
  formatLocation,
  phoneDigits,
  validateContact,
  type ContactForm,
} from "@/lib/contact";

// Contact form → Google Sheet. The Apps Script web app (google-apps-script/Code.gs) appends the row,
// stamps the time and emails a notification; this route validates the enquiry, adds the visitor's IP
// and keeps the script URL and secret off the client.
const SCRIPT_URL = process.env.GOOGLE_SHEET_SCRIPT_URL;
const SCRIPT_SECRET = process.env.GOOGLE_SHEET_SECRET;

export async function POST(request: Request) {
  if (!SCRIPT_URL || !SCRIPT_SECRET) {
    console.error("Contact form: set GOOGLE_SHEET_SCRIPT_URL and GOOGLE_SHEET_SECRET in .env.local");
    return NextResponse.json({ ok: false, error: "The form is not configured yet." }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Known fields only, strings only; the same rules as the form, since the browser can be bypassed
  const form = Object.fromEntries(
    CONTACT_FIELDS.map((field) => {
      const value = body?.[field];
      return [field, typeof value === "string" ? value.trim() : ""];
    })
  ) as ContactForm;

  const errors = validateContact(form);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", errors }, { status: 400 });
  }

  // As it should read in the sheet and the notification email
  const entry = {
    name: form.name,
    phone: `${form.countryCode} ${phoneDigits(form.phone)}`,
    email: form.email,
    location: formatLocation(form.location),
    service: form.service,
    currency: form.currency,
    budget: form.budget,
    message: form.message,
  };

  // The first address in x-forwarded-for is the visitor (set by Vercel and most hosts/proxies)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "";

  try {
    // Apps Script answers with a redirect to the actual JSON result; fetch follows it
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...entry, ip, secret: SCRIPT_SECRET }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await res.json();
    if (!result.ok) throw new Error(result.error);
    return NextResponse.json({ ok: true });
  } catch (err) {
    // An HTML response (JSON parse error) usually means the deployment's access isn't set to "Anyone"
    console.error("Contact form: saving to Google Sheet failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not send your enquiry. Please try again." },
      { status: 502 }
    );
  }
}
