import { NextResponse } from "next/server";

// Visitor's country (ISO 3166-1 alpha-2) from the geo header the host adds at the edge
// (Vercel, Cloudflare or CloudFront). `country` is null when there is none, e.g. in local dev.
export async function GET(request: Request) {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("cloudfront-viewer-country");

  return NextResponse.json(
    { country },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
