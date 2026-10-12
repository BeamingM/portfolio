import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const country = req.headers.get("x-vercel-ip-country") || "unknown";
    const city = req.headers.get("x-vercel-ip-city") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referer = req.headers.get("referer") || "unknown";

    const auditEntry = {
      event: "CONTACT_REVEAL",
      type: body.type || "email",
      surface: body.surface || "general",
      clientIp: ip,
      geo: {
        country,
        city,
      },
      userAgent,
      referer,
      timestamp: new Date().toISOString(),
    };

    // Vercel Serverless / Edge Function runtime structured log
    console.log("[VERCEL_AUDIT:CONTACT_REVEAL]", JSON.stringify(auditEntry));

    return NextResponse.json({ success: true, timestamp: auditEntry.timestamp });
  } catch (error) {
    console.error("Failed to log contact reveal:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
