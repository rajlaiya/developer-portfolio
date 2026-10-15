/**
 * Contact form → Google Sheet ("coding-with-rl leads") + Gmail notification
 *
 * The website's /api/contact route validates each enquiry and POSTs it here as JSON (with the
 * visitor's IP); this script appends it as a new row, stamps the time and emails NOTIFY_EMAIL.
 *
 * ONE-TIME SETUP
 *  1. Open the sheet → Extensions → Apps Script. Replace everything in Code.gs with this file and save.
 *  2. Pick "setup" in the function dropdown → Run → allow the permissions it asks for
 *     (Sheets, and "Send email as you" for the notifications).
 *     It writes the header row and prints a SECRET in the Execution log: copy it.
 *  3. Optional: pick "sendTestEmail" → Run, and check your inbox.
 *  4. Deploy → New deployment → type "Web app"
 *       Execute as: Me    ·    Who has access: Anyone
 *     → Deploy → copy the Web app URL (ends in /exec).
 *  5. In the website's .env.local (and in your hosting provider's environment variables):
 *       GOOGLE_SHEET_SCRIPT_URL=<the /exec URL>
 *       GOOGLE_SHEET_SECRET=<the secret from step 2>
 *     then restart `npm run dev`.
 *
 * UPDATING AN EXISTING DEPLOYMENT (e.g. to this version)
 *  Paste the new code and save → run "setup" once (approves any new permission; the SECRET stays the
 *  same) → Deploy → Manage deployments → ✏️ → Version: "New version" → Deploy.
 *  The /exec URL stays the same. Until you deploy a new version, the old code keeps running.
 */

const SPREADSHEET_ID = "18E6rQwBNrZoON2xYub12CmQ2QePAybfEwn35e9x7Sa4";
const SHEET_NAME = "Sheet1"; // falls back to the first tab if no tab has this name

// Who gets an email for every new enquiry
const NOTIFY_EMAIL = "rajlaiya2017@gmail.com";

// Form fields in sheet column order; Timestamp and IP Address follow
const FIELDS = ["name", "phone", "email", "location", "service", "currency", "budget", "message"];

const HEADERS = [
  "Name",
  "Phone Number",
  "Email ID",
  "Location",
  "Select Service",
  "Project Budget Currency",
  "Project Budget Value",
  "Message / Additional Project Details",
  "Timestamp",
  "IP Address",
];

const TIMESTAMP_FORMAT = "dd mmm yyyy, h:mm:ss am/pm";
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

/** Receives one enquiry from the website, appends it to the sheet and sends the notification. */
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "Invalid JSON" });
  }

  // Only the website knows the secret, so nobody else can write to the sheet via this URL
  const secret = PropertiesService.getScriptProperties().getProperty("SECRET");
  if (!secret || data.secret !== secret) {
    return json_({ ok: false, error: "Unauthorized" });
  }

  const entry = { ip: clean_(data.ip) };
  FIELDS.forEach(function (field) {
    entry[field] = clean_(data[field]);
  });
  entry.timestamp = new Date();

  // The website validates everything; this is a last safety net
  if (!entry.name || !EMAIL_RE.test(entry.email)) {
    return json_({ ok: false, error: "Name and a valid email are required" });
  }

  let sheet, row;

  // One write at a time, so two simultaneous enquiries can't land on the same row
  const lock = LockService.getScriptLock();
  try {
    sheet = getSheet_();
    lock.waitLock(10000);
    sheet.appendRow(
      FIELDS.map(function (field) {
        return asText_(entry[field]);
      }).concat([entry.timestamp, asText_(entry.ip)])
    );
    row = sheet.getLastRow();
    sheet.getRange(row, HEADERS.indexOf("Timestamp") + 1).setNumberFormat(TIMESTAMP_FORMAT);
  } catch (err) {
    console.error("Saving the enquiry failed: " + err);
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }

  // The lead is already saved, so a failed email is only logged and never fails the submission
  try {
    sendNotification_(entry, sheet, row);
  } catch (err) {
    console.error("Notification email failed: " + err);
  }

  return json_({ ok: true });
}

/** Opening the /exec URL in a browser shows this, handy to check the deployment works. */
function doGet() {
  return json_({ ok: true, message: "Contact form endpoint is live. The website sends enquiries here." });
}

/** Run once from the editor: writes the header row, freezes it and creates the shared SECRET. */
function setup() {
  const sheet = getSheet_();

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  // New Timestamp / IP Address headers get the same style as the existing "Name" header
  sheet.getRange("A1").copyFormatToRange(sheet, 1, HEADERS.length, 1, 1);
  sheet.setFrozenRows(1);

  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty("SECRET");
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
    props.setProperty("SECRET", secret);
  }
  console.log("Headers are ready. Put this in .env.local as GOOGLE_SHEET_SECRET:\n" + secret);
}

/** Run from the editor to preview the notification email (nothing is written to the sheet). */
function sendTestEmail() {
  const sheet = getSheet_();
  sendNotification_(
    {
      name: "Alex Morgan (test)",
      phone: "+91 9876543210",
      email: "alex@company.com",
      location: "India (IN)",
      service: "Website Development",
      currency: "INR",
      budget: "1,75,000 – 4,25,000",
      message: "This is a test enquiry sent from the Apps Script editor.",
      ip: "203.0.113.7",
      timestamp: new Date(),
    },
    sheet,
    sheet.getLastRow()
  );
  console.log("Test email sent to " + NOTIFY_EMAIL);
}

/** Emails NOTIFY_EMAIL about a new enquiry; hitting "Reply" in Gmail answers the lead directly. */
function sendNotification_(entry, sheet, row) {
  const spreadsheet = sheet.getParent();
  const when = Utilities.formatDate(entry.timestamp, spreadsheet.getSpreadsheetTimeZone(), "dd MMM yyyy, h:mm a");
  const sheetUrl = spreadsheet.getUrl() + "#gid=" + sheet.getSheetId() + "&range=A" + row;
  const phoneNumber = entry.phone.replace(/[^\d+]/g, "");

  const details = [
    ["Name", entry.name],
    ["Phone", entry.phone],
    ["Email", entry.email],
    ["Location", entry.location],
    ["Service", entry.service],
    ["Budget", entry.currency + " " + entry.budget],
    ["Message", entry.message || "—"],
    ["Received", when],
    ["IP address", entry.ip || "—"],
  ];

  const rowsHtml = details
    .map(function (d) {
      return (
        '<tr><td style="padding:8px 12px 8px 0;color:#71717a;vertical-align:top;white-space:nowrap">' +
        d[0] +
        '</td><td style="padding:8px 0;color:#18181b;font-weight:600">' +
        escapeHtml_(d[1]).replace(/\n/g, "<br>") +
        "</td></tr>"
      );
    })
    .join("");

  const button = function (href, label, primary) {
    return (
      '<a href="' + escapeHtml_(href) + '" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;' +
      "border-radius:999px;text-decoration:none;font-size:13px;font-weight:600;" +
      (primary ? "background:#0066ff;color:#ffffff" : "background:#f4f4f5;color:#18181b") +
      '">' + label + "</a>"
    );
  };

  const htmlBody =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;font-size:14px;line-height:1.5">' +
    '<h2 style="margin:0 0 4px;font-size:18px;color:#18181b">New enquiry from ' + escapeHtml_(entry.name) + "</h2>" +
    '<p style="margin:0 0 16px;color:#71717a;font-size:13px">via your portfolio contact form</p>' +
    '<table style="border-collapse:collapse;width:100%;border-top:1px solid #e4e4e7">' + rowsHtml + "</table>" +
    '<p style="margin:20px 0 0">' +
    button("mailto:" + entry.email + "?subject=" + encodeURIComponent("Re: your " + entry.service + " enquiry"), "Reply by email", true) +
    button("tel:" + phoneNumber, "Call", false) +
    button("https://wa.me/" + phoneNumber.replace("+", ""), "WhatsApp", false) +
    button(sheetUrl, "Open in Google Sheet", false) +
    "</p></div>";

  const textBody =
    "New enquiry from your portfolio contact form\n\n" +
    details.map(function (d) { return d[0] + ": " + d[1]; }).join("\n") +
    "\n\nGoogle Sheet: " + sheetUrl;

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: entry.email,
    name: "Portfolio Contact Form",
    subject: "New enquiry: " + entry.name + " · " + entry.service,
    body: textBody,
    htmlBody: htmlBody,
  });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
}

/** A form value as a trimmed single string, capped so nobody can stuff huge payloads in. */
function clean_(value) {
  return String(value == null ? "" : value).trim().slice(0, 1000);
}

/**
 * A leading = + - @ would make Sheets read a value as a formula (or turn "+91 9876543210" into a
 * number), so such values get a ' prefix to stay plain text in the cell.
 */
function asText_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
