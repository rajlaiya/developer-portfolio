// Contact form options and validation rules, shared by the form (instant feedback while typing)
// and /api/contact (the check that actually counts, since the browser can be bypassed)

export const CONTACT_FIELDS = [
  "name",
  "countryCode",
  "phone",
  "email",
  "location",
  "service",
  "currency",
  "budget",
  "message",
] as const;

export type ContactForm = Record<(typeof CONTACT_FIELDS)[number], string>;

// Errors are keyed by the field (input id) they are shown under
export type ContactErrorField = "name" | "phone" | "email" | "service" | "location" | "budget" | "message";
export type ContactErrors = Partial<Record<ContactErrorField, string>>;

export const MESSAGE_MAX = 250;

// Locations offered in the form: the same five countries as the budget currencies
export const LOCATIONS = [
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SG", name: "Singapore" },
];
// Picked for visitors from any other country, so they can still submit the form
export const OTHER_LOCATION = "Other";

export function formatLocation(code: string) {
  const location = LOCATIONS.find((l) => l.code === code);
  return location ? `${location.name} (${location.code})` : code;
}

// Dialling codes with what a valid number looks like there (digits after the code, without a leading 0)
export const PHONE_CODES = [
  { code: "+91", pattern: /^[6-9]\d{9}$/, example: "98765 43210", error: "Enter a valid 10-digit Indian mobile number." },
  { code: "+1", pattern: /^[2-9]\d{9}$/, example: "416 555 0123", error: "Enter a valid 10-digit Canada / US number." },
  { code: "+971", pattern: /^[2-9]\d{7,8}$/, example: "50 123 4567", error: "Enter a valid UAE number (8–9 digits)." },
  { code: "+94", pattern: /^[1-9]\d{8}$/, example: "71 234 5678", error: "Enter a valid 9-digit Sri Lankan number." },
  { code: "+65", pattern: /^[3689]\d{7}$/, example: "8123 4567", error: "Enter a valid 8-digit Singapore number." },
  { code: "+44", pattern: /^[1-9]\d{8,9}$/, example: "7400 123456", error: "Enter a valid UK number (10 digits)." },
  { code: "+61", pattern: /^[1-9]\d{8}$/, example: "412 345 678", error: "Enter a valid 9-digit Australian number." },
];

// Digits only, minus the national trunk 0 people often type (e.g. UK "07400…", UAE "050…")
export function phoneDigits(phone: string) {
  return phone.replace(/[\s-]/g, "").replace(/^0/, "");
}

// Budget currencies; each placeholder is roughly the old $2,000 – $5,000 range in that currency
export const CURRENCIES = [
  { code: "INR", label: "₹ INR", country: "India", example: "1,75,000 – 4,25,000" },
  { code: "CAD", label: "C$ CAD", country: "Canada", example: "2,500 – 7,000" },
  { code: "AED", label: "AED", country: "UAE", example: "7,500 – 18,000" },
  { code: "LKR", label: "Rs LKR", country: "Sri Lanka", example: "600,000 – 1,500,000" },
  { code: "SGD", label: "S$ SGD", country: "Singapore", example: "2,500 – 6,500" },
];

export const SERVICES = [
  "Website Development",
  "Web App / SaaS Development",
  "E-Commerce Development",
  "Mobile App Development",
  "UI/UX Design",
  "CRM/CMS",
  "Modern Landing Page",
];

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
// One amount ("2,00,000") or a range ("1,75,000 – 4,25,000"); commas and decimals allowed
const AMOUNT = String.raw`\d[\d,]*(?:\.\d+)?`;
const BUDGET_RE = new RegExp(`^(${AMOUNT})(?:\\s*[-–]\\s*(${AMOUNT}))?$`);

export function validateContact(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const budget = form.budget.trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length < 2 || name.length > 60) errors.name = "Name should be 2–60 characters.";
  else if (!NAME_RE.test(name)) errors.name = "Name can only contain letters, spaces, . ' and -";

  const phoneCode = PHONE_CODES.find((p) => p.code === form.countryCode);
  if (!phone) errors.phone = "Please enter your phone number.";
  else if (!phoneCode) errors.phone = "Please choose a country code.";
  else if (!/^[\d\s-]+$/.test(phone)) errors.phone = "Phone number can only contain digits.";
  else if (!phoneCode.pattern.test(phoneDigits(phone))) errors.phone = phoneCode.error;

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > 254 || !EMAIL_RE.test(email) || email.includes(".."))
    errors.email = "Enter a valid email address, e.g. alex@company.com.";

  if (!SERVICES.includes(form.service)) errors.service = "Please choose a service.";

  if (!LOCATIONS.some((l) => l.code === form.location) && form.location !== OTHER_LOCATION)
    errors.location = "Please choose your location.";

  const range = budget.match(BUDGET_RE);
  const [min, max] = [range?.[1], range?.[2]].map((n) => (n ? Number(n.replace(/,/g, "")) : NaN));
  if (!CURRENCIES.some((c) => c.code === form.currency)) errors.budget = "Please choose a currency.";
  else if (!budget) errors.budget = "Please enter your project budget.";
  else if (!range || budget.length > 40) errors.budget = "Enter an amount or a range using numbers only, e.g. 2,500 – 7,000.";
  else if (!(min > 0)) errors.budget = "Budget must be more than 0.";
  else if (max <= min) errors.budget = "The second amount of the range should be higher than the first.";

  if (form.message.trim().length > MESSAGE_MAX) errors.message = `Message can be at most ${MESSAGE_MAX} characters.`;

  return errors;
}
