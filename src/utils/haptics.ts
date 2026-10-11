/**
 * Web Vibration API Micro-Haptics for touch devices
 */
export function triggerHaptic(type: "light" | "medium" | "snap" | "success" = "light") {
  if (typeof window === "undefined" || !("vibrate" in navigator)) return;

  try {
    switch (type) {
      case "light":
        navigator.vibrate(8);
        break;
      case "medium":
        navigator.vibrate(15);
        break;
      case "snap":
        navigator.vibrate(22);
        break;
      case "success":
        navigator.vibrate([10, 40, 15]);
        break;
    }
  } catch {
    // Ignore unsupported/blocked vibration calls
  }
}
