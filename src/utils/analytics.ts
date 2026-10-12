import { track } from "@vercel/analytics";

/**
 * Tracks contact reveal / interaction events to Vercel Analytics and Server Audit log.
 * @param surface The UI location where the reveal occurred (e.g. "about_page", "site_footer", "atelier_drawer", "command_palette")
 * @param contactType The type of contact info being revealed (default "email")
 */
export async function trackContactReveal(surface: string, contactType: string = "email") {
  // 1. Client-side Vercel Web Analytics Event (Counts, Conversion, Geographies)
  try {
    track("contact_reveal", {
      type: contactType,
      surface,
      referrer: typeof document !== "undefined" ? document.referrer || "direct" : "unknown",
      time: new Date().toISOString(),
    });
  } catch {
    // Non-blocking fallback
  }

  // 2. Server-side Vercel Observability Log Audit (Detailed IP, Geo City, Device)
  try {
    await fetch("/api/track/contact-reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: contactType,
        surface,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Non-blocking fallback
  }
}
