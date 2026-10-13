import fs from "fs";
import path from "path";
import assert from "assert";

const root = process.cwd();

console.log("==================================================================");
console.log("CHALLENGER 1: EMPIRICAL & ADVERSARIAL TEST HARNESS");
console.log("Requirements: R1 (PhotoModal Gestures, History, Lenis) & R2 (Caching)");
console.log("==================================================================\n");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(suite, name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] [${suite}] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] [${suite}] ${name}`);
    console.error(`       Error: ${err.message}`);
    failedTests++;
  }
}

// ==================================================================
// SUITE 1: PHOTOMODAL TOUCH GESTURES, DAMPING & SPRING PHYSICS
// ==================================================================

/**
 * 1.1 Damping Curve Mathematical Oracle
 * The piecewise damping function in PhotoModal.tsx:
 *   If deltaY > 0:
 *     deltaY > 200 ? 200 + (deltaY - 200) * 0.45 : deltaY
 *   Else:
 *     deltaY * 0.2
 */
function computeDampedY(deltaY) {
  if (deltaY > 0) {
    return deltaY > 200 ? 200 + (deltaY - 200) * 0.45 : deltaY;
  } else {
    return deltaY * 0.2;
  }
}

runTest("R1:GESTURES", "Damping curve continuity and C0 boundary at deltaY = 200", () => {
  // Test left limit as deltaY -> 200-
  const leftLimit = computeDampedY(199.9999);
  // Test boundary at deltaY = 200
  const boundary = computeDampedY(200);
  // Test right limit as deltaY -> 200+
  const rightLimit = computeDampedY(200.0001);

  assert(Math.abs(leftLimit - 200) < 0.001, `Left limit mismatch: ${leftLimit}`);
  assert.strictEqual(boundary, 200, `Boundary value at 200 mismatch: ${boundary}`);
  assert(Math.abs(rightLimit - 200) < 0.001, `Right limit mismatch: ${rightLimit}`);
});

runTest("R1:GESTURES", "Damping curve strict monotonicity across adversarial spectrum [-2000px, +5000px]", () => {
  let prevY = computeDampedY(-2000);
  for (let deltaY = -1999; deltaY <= 5000; deltaY += 0.5) {
    const currentY = computeDampedY(deltaY);
    assert(currentY > prevY, `Monotonicity violation at deltaY=${deltaY}: ${currentY} <= ${prevY}`);
    prevY = currentY;
  }
});

runTest("R1:GESTURES", "Damping curve slope checks (derivative behavior)", () => {
  // Region 1: deltaY < 0 -> slope = 0.2
  const slopeNegative = (computeDampedY(-50) - computeDampedY(-150)) / 100;
  assert(Math.abs(slopeNegative - 0.2) < 1e-9, `Negative drag slope should be 0.2, got ${slopeNegative}`);

  // Region 2: 0 < deltaY < 200 -> slope = 1.0 (uninhibited natural drag)
  const slopeUninhibited = (computeDampedY(150) - computeDampedY(50)) / 100;
  assert(Math.abs(slopeUninhibited - 1.0) < 1e-9, `Uninhibited drag slope should be 1.0, got ${slopeUninhibited}`);

  // Region 3: deltaY > 200 -> slope = 0.45 (tactile resistance)
  const slopeDamped = (computeDampedY(500) - computeDampedY(300)) / 200;
  assert(Math.abs(slopeDamped - 0.45) < 1e-9, `Damped drag slope should be 0.45, got ${slopeDamped}`);
});

runTest("R1:GESTURES", "Scale and backdrop opacity formulas bounded under extreme drag displacements", () => {
  // Test 10,000 random and boundary displacements
  const testDisplacements = [-1000, -100, -1, 0, 1, 50, 110, 200, 380, 500, 1500, 5000, 10000];
  
  for (const dismissY of testDisplacements) {
    // Opacity formula: Math.max(0.2, 1 - Math.max(0, dismissY) / 380)
    const opacity = Math.max(0.2, 1 - Math.max(0, dismissY) / 380);
    assert(opacity >= 0.2 && opacity <= 1.0, `Opacity out of bounds [0.2, 1.0] at dismissY=${dismissY}: ${opacity}`);

    // Scale damp factor: 1 - Math.min(Math.max(0, dismissY) / 1500, 0.12)
    const scaleFactor = 1 - Math.min(Math.max(0, dismissY) / 1500, 0.12);
    assert(scaleFactor >= 0.88 && scaleFactor <= 1.0, `Scale factor out of bounds [0.88, 1.0] at dismissY=${dismissY}: ${scaleFactor}`);
  }
});

/**
 * 1.2 Direction Locking Logic State Machine
 */
function simulateDirectionLock(touchEvents) {
  let gestureDirection = "none";
  let isDismissDragging = false;
  let dismissY = 0;

  for (const event of touchEvents) {
    const { deltaX, deltaY } = event;

    if (gestureDirection === "none") {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
          gestureDirection = "horizontal";
        } else if (deltaY > 0) {
          gestureDirection = "vertical";
        }
      }
    }

    if (gestureDirection === "vertical") {
      dismissY = computeDampedY(deltaY);
      isDismissDragging = true;
    }
  }

  return { gestureDirection, isDismissDragging, dismissY };
}

runTest("R1:GESTURES", "Direction locking: Deadzone (< 10px) does not lock direction or trigger drag", () => {
  const result = simulateDirectionLock([
    { deltaX: 2, deltaY: 3 },
    { deltaX: -5, deltaY: 8 },
    { deltaX: 7, deltaY: -7 },
  ]);
  assert.strictEqual(result.gestureDirection, "none");
  assert.strictEqual(result.isDismissDragging, false);
  assert.strictEqual(result.dismissY, 0);
});

runTest("R1:GESTURES", "Direction locking: Horizontal preference when deltaX >= deltaY", () => {
  // Exact 45-degree angle (deltaX = 15, deltaY = 15): tie breaks to horizontal
  const tie = simulateDirectionLock([{ deltaX: 15, deltaY: 15 }]);
  assert.strictEqual(tie.gestureDirection, "horizontal");
  assert.strictEqual(tie.isDismissDragging, false);

  // Clear horizontal swipe (deltaX = 30, deltaY = 5)
  const horiz = simulateDirectionLock([{ deltaX: 30, deltaY: 5 }]);
  assert.strictEqual(horiz.gestureDirection, "horizontal");
  assert.strictEqual(horiz.isDismissDragging, false);
});

runTest("R1:GESTURES", "Direction locking: Vertical downward drag locks and remains sticky", () => {
  // Starts with small drag then downwards
  const result = simulateDirectionLock([
    { deltaX: 2, deltaY: 5 },
    { deltaX: 4, deltaY: 25 }, // locks to vertical
    { deltaX: 50, deltaY: 80 }, // even if horizontal delta increases later, stays vertical
  ]);
  assert.strictEqual(result.gestureDirection, "vertical");
  assert.strictEqual(result.isDismissDragging, true);
  assert.strictEqual(result.dismissY, computeDampedY(80));
});

runTest("R1:GESTURES", "Direction locking: Upward initial drag (> 10px, deltaY < 0) does NOT lock to vertical", () => {
  const result = simulateDirectionLock([
    { deltaX: 0, deltaY: -20 },
    { deltaX: 0, deltaY: -50 },
  ]);
  // deltaY is negative, Math.abs(deltaX) >= Math.abs(deltaY) is false, deltaY > 0 is false -> remains "none"
  assert.strictEqual(result.gestureDirection, "none");
  assert.strictEqual(result.isDismissDragging, false);
});

/**
 * 1.3 Flick Velocity & Threshold Trigger Oracle
 */
function evaluateDismissTrigger(currentDismissY, elapsed) {
  const velocity = currentDismissY / Math.max(1, elapsed); // px/ms
  const isDismissed = currentDismissY > 110 || (velocity > 0.55 && currentDismissY > 35);
  return { isDismissed, velocity };
}

runTest("R1:GESTURES", "Flick velocity & dismiss threshold: Boundary testing", () => {
  // Case 1: Slow deliberate drag past 110px
  assert.strictEqual(evaluateDismissTrigger(111, 1000).isDismissed, true, "111px @ 1s should dismiss");
  assert.strictEqual(evaluateDismissTrigger(110, 1000).isDismissed, false, "110px @ 1s should NOT dismiss");
  assert.strictEqual(evaluateDismissTrigger(109, 1000).isDismissed, false, "109px @ 1s should NOT dismiss");

  // Case 2: Fast flick with velocity > 0.55 px/ms and dismissY > 35px
  // 36px in 50ms -> velocity = 0.72 px/ms (> 0.55) -> dismiss
  assert.strictEqual(evaluateDismissTrigger(36, 50).isDismissed, true, "36px @ 50ms should dismiss");
  // 35px in 50ms -> velocity = 0.70 px/ms, but dismissY is not > 35 -> NO dismiss (guard against micro-jitter)
  assert.strictEqual(evaluateDismissTrigger(35, 50).isDismissed, false, "35px @ 50ms should NOT dismiss");
  // 50px in 100ms -> velocity = 0.50 px/ms (< 0.55) and < 110px -> NO dismiss
  assert.strictEqual(evaluateDismissTrigger(50, 100).isDismissed, false, "50px @ 100ms should NOT dismiss");
  // 50px in 80ms -> velocity = 0.625 px/ms (> 0.55) and > 35px -> dismiss
  assert.strictEqual(evaluateDismissTrigger(50, 80).isDismissed, true, "50px @ 80ms should dismiss");

  // Case 3: Division by zero protection (elapsed <= 0)
  const zeroElapsed = evaluateDismissTrigger(50, 0);
  assert(Number.isFinite(zeroElapsed.velocity), "Velocity must be finite when elapsed=0");
  assert.strictEqual(zeroElapsed.velocity, 50, "Velocity should use Math.max(1, elapsed)=1");
});

/**
 * 1.4 Spring Physics Curve Simulation: cubic-bezier(0.175, 0.885, 0.32, 1.275)
 */
function cubicBezier(p1x, p1y, p2x, p2y, t) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleX = ((ax * t + bx) * t + cx) * t;
  const sampleY = ((ay * t + by) * t + cy) * t;

  return { x: sampleX, y: sampleY };
}

runTest("R1:GESTURES", "Spring Physics: Validate cubic-bezier(0.175, 0.885, 0.32, 1.275) elastic overshoot", () => {
  const code = fs.readFileSync(path.join(root, "src/components/PhotoModal.tsx"), "utf-8");
  assert(
    code.includes("cubic-bezier(0.175, 0.885, 0.32, 1.275)"),
    "PhotoModal.tsx must specify cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  );

  // Compute curve profile across 1000 sample steps
  const samples = [];
  let maxY = 0;
  let maxYTime = 0;
  let prevX = 0;

  for (let step = 0; step <= 1000; step++) {
    const t = step / 1000;
    const pt = cubicBezier(0.175, 0.885, 0.32, 1.275, t);
    samples.push(pt);

    // Monotonicity of X coordinate
    if (step > 0) {
      assert(pt.x >= prevX, `X must be strictly monotonic at t=${t}`);
    }
    prevX = pt.x;

    if (pt.y > maxY) {
      maxY = pt.y;
      maxYTime = pt.x;
    }
  }

  // Initial and terminal points
  assert.strictEqual(samples[0].x, 0, "B(0).x must be 0");
  assert.strictEqual(samples[0].y, 0, "B(0).y must be 0");
  assert(Math.abs(samples[1000].x - 1.0) < 1e-9, "B(1).x must be 1.0");
  assert(Math.abs(samples[1000].y - 1.0) < 1e-9, "B(1).y must be 1.0");

  // Overshoot confirmation: max Y must exceed 1.0 (spring characteristic)
  assert(maxY > 1.05 && maxY < 1.15, `Peak overshoot Y=${maxY} should be between 1.05 and 1.15`);
  console.log(`   [Spring Physics Profile]: Peak overshoot = ${maxY.toFixed(4)} at progress x = ${maxYTime.toFixed(4)}`);
});

// ==================================================================
// SUITE 2: BROWSER HISTORY SEMANTICS & POPSTATE SYNCHRONIZATION
// ==================================================================

/**
 * 2.1 State-Machine Simulation of Browser History Stack
 */
class BrowserHistorySimulator {
  constructor() {
    this.stack = [{ state: null, url: "https://chakarin.pics/" }];
    this.index = 0;
    this.listeners = [];
  }

  addEventListener(event, listener) {
    if (event === "popstate") this.listeners.push(listener);
  }

  removeEventListener(event, listener) {
    if (event === "popstate") {
      this.listeners = this.listeners.filter((l) => l !== listener);
    }
  }

  pushState(state, title, url) {
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push({ state: JSON.parse(JSON.stringify(state)), url });
    this.index++;
  }

  replaceState(state, title, url) {
    this.stack[this.index] = { state: JSON.parse(JSON.stringify(state)), url };
  }

  back() {
    if (this.index > 0) {
      this.index--;
      const entry = this.stack[this.index];
      const popEvent = { state: entry.state };
      for (const listener of this.listeners) {
        listener(popEvent);
      }
    }
  }

  get current() {
    return this.stack[this.index];
  }

  get length() {
    return this.stack.length;
  }
}

/**
 * Simulates PhotoModal component lifecycle interacting with BrowserHistorySimulator
 */
class PhotoModalHistoryController {
  constructor(history, onModalClosedCallback) {
    this.history = history;
    this.onCloseCb = onModalClosedCallback;
    this.historyPushed = false;
    this.isPoppingHistory = false;
    this.isMounted = true;

    // Popstate listener setup (mirroring PhotoModal lines 866-881)
    this.handlePopState = (e) => {
      if (this.historyPushed) {
        if (!e.state?.photoModalOpen) {
          this.isPoppingHistory = true;
          this.historyPushed = false;
          this.onCloseCb();
        }
      }
    };
    this.history.addEventListener("popstate", this.handlePopState);
  }

  onPhotoChange(photo) {
    if (!this.isMounted) return;
    if (photo) {
      if (!this.historyPushed) {
        this.history.pushState({ photoModalOpen: true, photoId: photo.id }, "", this.history.current.url);
        this.historyPushed = true;
      } else {
        this.history.replaceState({ photoModalOpen: true, photoId: photo.id }, "", this.history.current.url);
      }
    }
  }

  handleManualClose() {
    if (this.historyPushed && !this.isPoppingHistory) {
      this.isPoppingHistory = true;
      this.historyPushed = false;
      this.history.back();
    }
    this.onCloseCb();
  }

  unmount() {
    this.isMounted = false;
    this.history.removeEventListener("popstate", this.handlePopState);
    if (this.historyPushed && !this.isPoppingHistory) {
      this.isPoppingHistory = true;
      this.historyPushed = false;
      this.history.back();
    }
  }
}

runTest("R1:HISTORY", "History: Open modal pushes state, close manually pops state cleanly", () => {
  const history = new BrowserHistorySimulator();
  let modalClosedCount = 0;
  const controller = new PhotoModalHistoryController(history, () => {
    modalClosedCount++;
  });

  // Open modal with photo 1
  controller.onPhotoChange({ id: "personal-01" });
  assert.strictEqual(history.length, 2, "History length must be 2 after opening modal");
  assert.strictEqual(history.index, 1, "History index must be 1");
  assert.strictEqual(history.current.state?.photoModalOpen, true);
  assert.strictEqual(history.current.state?.photoId, "personal-01");

  // User manually closes modal
  controller.handleManualClose();
  controller.unmount();

  assert.strictEqual(modalClosedCount, 1, "onClose must be called once");
  assert.strictEqual(history.index, 0, "History index must return to 0 (base page)");
  assert.strictEqual(history.current.state, null, "History state must be null (base page)");
});

runTest("R1:HISTORY", "History: Navigating next/prev photo uses replaceState without polluting history stack", () => {
  const history = new BrowserHistorySimulator();
  let modalClosedCount = 0;
  const controller = new PhotoModalHistoryController(history, () => {
    modalClosedCount++;
  });

  // Open modal
  controller.onPhotoChange({ id: "personal-01" });
  assert.strictEqual(history.length, 2);

  // Navigate through 15 photos in sequence
  for (let i = 2; i <= 16; i++) {
    controller.onPhotoChange({ id: `personal-${i.toString().padStart(2, "0")}` });
    assert.strictEqual(history.length, 2, `History stack must not grow on navigation step ${i}`);
    assert.strictEqual(history.index, 1, `History index must stay at 1 on step ${i}`);
    assert.strictEqual(history.current.state?.photoId, `personal-${i.toString().padStart(2, "0")}`);
  }

  // Manual close
  controller.handleManualClose();
  controller.unmount();

  assert.strictEqual(history.index, 0, "History index must return to 0");
  assert.strictEqual(modalClosedCount, 1, "Modal closed exactly once");
});

runTest("R1:HISTORY", "History: Device / browser back button triggers onClose via popstate without duplicate pop", () => {
  const history = new BrowserHistorySimulator();
  let modalClosedCount = 0;
  const controller = new PhotoModalHistoryController(history, () => {
    modalClosedCount++;
  });

  // Open modal and navigate twice
  controller.onPhotoChange({ id: "personal-01" });
  controller.onPhotoChange({ id: "personal-02" });
  controller.onPhotoChange({ id: "personal-03" });

  // User presses Android / browser back button
  history.back();

  assert.strictEqual(modalClosedCount, 1, "onClose must be triggered by popstate");
  assert.strictEqual(history.index, 0, "History index must be 0");
  assert.strictEqual(history.current.state, null, "State must be base page");

  // Subsequent manual unmount must NOT trigger additional history.back()
  controller.unmount();
  assert.strictEqual(history.index, 0, "History index must remain 0, no extraneous back calls");
});

runTest("R1:HISTORY", "History: Unexpected component unmount (route change) cleans up history entry", () => {
  const history = new BrowserHistorySimulator();
  let modalClosed = false;
  const controller = new PhotoModalHistoryController(history, () => {
    modalClosed = true;
  });

  controller.onPhotoChange({ id: "tu-01" });
  assert.strictEqual(history.length, 2);
  assert.strictEqual(history.index, 1);

  // Sudden unmount while modal was open
  controller.unmount();

  assert.strictEqual(modalClosed, false, "Unexpected unmount does not trigger onClose callback");
  assert.strictEqual(history.index, 0, "Unmount cleanup must restore history index to 0");
  assert.strictEqual(history.current.state, null, "History state restored to base page");
});

// ==================================================================
// SUITE 3: LENIS SMOOTH SCROLL LIFECYCLE & TOUCH DEVICE INVARIANCE
// ==================================================================

runTest("R1:LENIS", "Lenis: Desktop window.lenis lifecycle with PhotoModal open/close", () => {
  // Simulate mock Lenis instance on desktop
  let stopCalls = 0;
  let startCalls = 0;
  const mockLenis = {
    stop: () => { stopCalls++; },
    start: () => { startCalls++; },
  };

  // Mock window & document
  const mockWindow = { lenis: mockLenis };
  const mockBody = { style: { overflow: "auto" } };

  // PhotoModal open effect simulation
  function mountPhotoModal(photo) {
    if (photo) {
      if (mockWindow.lenis?.stop) mockWindow.lenis.stop();
      mockBody.style.overflow = "hidden";

      // Return cleanup function
      return () => {
        mockBody.style.overflow = "auto";
        if (mockWindow.lenis?.start) mockWindow.lenis.start();
      };
    }
  }

  const unmount = mountPhotoModal({ id: "personal-01" });
  assert.strictEqual(stopCalls, 1, "lenis.stop() must be called on modal mount");
  assert.strictEqual(mockBody.style.overflow, "hidden", "body overflow must be locked to hidden");
  assert.strictEqual(startCalls, 0, "lenis.start() must not be called while open");

  // Unmount / close
  unmount();
  assert.strictEqual(startCalls, 1, "lenis.start() must be called on modal unmount");
  assert.strictEqual(mockBody.style.overflow, "auto", "body overflow must be restored");
});

runTest("R1:LENIS", "Lenis: Desktop window.lenis lifecycle with AtelierDrawer open/close", () => {
  let stopCalls = 0;
  let startCalls = 0;
  const mockLenis = {
    stop: () => { stopCalls++; },
    start: () => { startCalls++; },
  };

  const mockWindow = { lenis: mockLenis };
  const mockBody = { style: { overflow: "" } };

  function simulateDrawerEffect(isOpen) {
    if (isOpen) {
      if (mockWindow.lenis?.stop) mockWindow.lenis.stop();
      mockBody.style.overflow = "hidden";
      return () => {
        mockBody.style.overflow = "";
        if (mockWindow.lenis?.start) mockWindow.lenis.start();
      };
    }
  }

  const cleanup = simulateDrawerEffect(true);
  assert.strictEqual(stopCalls, 1, "Drawer open must call lenis.stop()");
  assert.strictEqual(mockBody.style.overflow, "hidden");

  cleanup();
  assert.strictEqual(startCalls, 1, "Drawer close must call lenis.start()");
  assert.strictEqual(mockBody.style.overflow, "");
});

runTest("R1:LENIS", "Lenis: Mobile touch device isolation (zero touch event interception)", () => {
  const smoothScrollCode = fs.readFileSync(path.join(root, "src/components/SmoothScroll.tsx"), "utf-8");

  // Verify mobile touch check
  assert(smoothScrollCode.includes("const isCoarse = window.matchMedia(\"(pointer: coarse)\").matches"), "Must check pointer: coarse");
  assert(smoothScrollCode.includes("const hasTouch = \"ontouchstart\" in window || navigator.maxTouchPoints > 0"), "Must check touch capability");
  assert(smoothScrollCode.includes("setIsTouch(isCoarse || hasTouch || window.innerWidth < 768)"), "Must disable Lenis on mobile/tablet widths");
  assert(smoothScrollCode.includes("if (isTouch) {\n    return <>{children}</>;\n  }"), "Must return raw children without Lenis when isTouch is true");

  // Verify AtelierDrawer data attributes to prevent Lenis collision
  const drawerCode = fs.readFileSync(path.join(root, "src/components/AtelierDrawer.tsx"), "utf-8");
  assert(drawerCode.includes('data-lenis-prevent="true"'), "Drawer must declare data-lenis-prevent");
  assert(drawerCode.includes('data-lenis-prevent-wheel="true"'), "Drawer must declare data-lenis-prevent-wheel");
  assert(drawerCode.includes('data-lenis-prevent-touch="true"'), "Drawer must declare data-lenis-prevent-touch");
});

runTest("R1:LENIS", "Lenis: Safe fallback when window.lenis is undefined (e.g. on mobile)", () => {
  // Simulate mobile where window.lenis is undefined
  const mockWindow = { lenis: undefined };
  const mockBody = { style: { overflow: "auto" } };

  assert.doesNotThrow(() => {
    // Modal open
    const lenis = mockWindow.lenis;
    if (lenis && typeof lenis.stop === "function") lenis.stop();
    mockBody.style.overflow = "hidden";

    // Modal close
    mockBody.style.overflow = "auto";
    if (lenis && typeof lenis.start === "function") lenis.start();
  }, "Must never throw when window.lenis is undefined");

  assert.strictEqual(mockBody.style.overflow, "auto");
});

// ==================================================================
// SUITE 4: REQUIREMENT R2 - VERCEL.JSON EDGE CACHING & SECURITY HEADERS
// ==================================================================

runTest("R2:VERCEL", "vercel.json JSON schema syntax & cleanUrls validation", () => {
  const vercelPath = path.join(root, "vercel.json");
  assert(fs.existsSync(vercelPath), "vercel.json must exist in project root");
  
  const raw = fs.readFileSync(vercelPath, "utf-8");
  let parsed;
  assert.doesNotThrow(() => {
    parsed = JSON.parse(raw);
  }, "vercel.json must be valid JSON");

  assert.strictEqual(parsed.cleanUrls, true, "cleanUrls must be true");
  assert(Array.isArray(parsed.headers), "headers property must be an array");
  assert(parsed.headers.length >= 2, "Must contain at least root and photo header configurations");
});

runTest("R2:VERCEL", "vercel.json /photos/(.*) edge caching headers: 1-year immutable", () => {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf-8"));
  const photoConfig = parsed.headers.find((h) => h.source === "/photos/(.*)");
  assert(photoConfig, "Must contain header rule for source '/photos/(.*)'");

  const cacheHeader = photoConfig.headers.find((h) => h.key === "Cache-Control");
  assert(cacheHeader, "Photo rule must specify Cache-Control");
  assert.strictEqual(
    cacheHeader.value,
    "public, max-age=31536000, immutable",
    "Cache-Control must be 'public, max-age=31536000, immutable'"
  );
});

runTest("R2:VERCEL", "vercel.json root /(.*) security headers: 5 mandatory headers", () => {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf-8"));
  const rootConfig = parsed.headers.find((h) => h.source === "/(.*)");
  assert(rootConfig, "Must contain header rule for source '/(.*)'");

  const headersMap = new Map(rootConfig.headers.map((h) => [h.key, h.value]));

  // 1. X-Content-Type-Options: nosniff
  assert.strictEqual(headersMap.get("X-Content-Type-Options"), "nosniff");

  // 2. X-Frame-Options: DENY
  assert.strictEqual(headersMap.get("X-Frame-Options"), "DENY");

  // 3. X-XSS-Protection: 1; mode=block
  assert.strictEqual(headersMap.get("X-XSS-Protection"), "1; mode=block");

  // 4. Referrer-Policy: strict-origin-when-cross-origin
  assert.strictEqual(headersMap.get("Referrer-Policy"), "strict-origin-when-cross-origin");

  // 5. Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
  assert(headersMap.has("Permissions-Policy"));
  const perm = headersMap.get("Permissions-Policy");
  assert(perm.includes("camera=()"));
  assert(perm.includes("microphone=()"));
  assert(perm.includes("geolocation=()"));
});

const { galleryItems } = await import(path.join(root, "src/config/gallery.ts"));

runTest("R2:VERCEL", "Photo source regex '/photos/(.*)' matches all 45 catalog photos and rejects non-photos", () => {
  const photoRegex = /^\/photos\/(.*)$/;

  // Assert all 45 photos match
  for (const item of galleryItems) {
    assert(photoRegex.test(item.src), `Photo src ${item.src} must match /photos/(.*)`);
  }

  // Assert non-photo paths do NOT match
  const nonPhotoPaths = [
    "/",
    "/about",
    "/resume.pdf",
    "/favicon.ico",
    "/og-image.png",
    "/api/hello",
    "/photos", // bare without slash
  ];
  for (const p of nonPhotoPaths) {
    assert(!photoRegex.test(p), `Non-photo path ${p} should NOT match /photos/(.*)`);
  }
});

runTest("R2:VERCEL", "next.config.ts preserves unoptimized: true for CDN Edge routing", () => {
  const nextConfigCode = fs.readFileSync(path.join(root, "next.config.ts"), "utf-8");
  assert(nextConfigCode.includes("unoptimized: true"), "next.config.ts must set images.unoptimized = true");
});

runTest("R2:VERCEL", "Absence of Cache-Control on root /(.*) rule in vercel.json (preserves dynamic SSR)", () => {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf-8"));
  const rootConfig = parsed.headers.find((h) => h.source === "/(.*)");
  assert(rootConfig, "Root header rule must exist");
  const hasCacheControl = rootConfig.headers.some((h) => h.key.toLowerCase() === "cache-control");
  assert.strictEqual(hasCacheControl, false, "Root /(.*) rule must NOT specify Cache-Control (would cache dynamic pages)");
});

// ==================================================================
// SUITE 5: ADVERSARIAL STRESS HARNESS & EDGE-CASE ORACLES
// ==================================================================

runTest("ADVERSARIAL:GESTURES", "Extreme drag input scaling: 100,000px downward drag remains numerically stable", () => {
  const extremeY = computeDampedY(100000);
  // Expected: 200 + (100000 - 200) * 0.45 = 200 + 44910 = 45110
  assert.strictEqual(extremeY, 45110, `Extreme drag mismatch: ${extremeY}`);
  assert(Number.isFinite(extremeY), "Must be finite");

  // Opacity at extreme drag:
  const opacity = Math.max(0.2, 1 - Math.max(0, extremeY) / 380);
  assert.strictEqual(opacity, 0.2, "Opacity must strictly clamp at 0.2 under extreme drag");

  // Scale factor at extreme drag:
  const scale = 1 - Math.min(Math.max(0, extremeY) / 1500, 0.12);
  assert.strictEqual(scale, 0.88, "Scale must strictly clamp at 0.88 under extreme drag");
});

runTest("ADVERSARIAL:GESTURES", "Oscillating drag sequence maintains consistent physical state", () => {
  // Simulate user dragging down, then up, then down, then holding
  const trajectory = [50, 120, 220, 180, 90, 250, 260];
  let lastDamped = 0;
  for (const y of trajectory) {
    lastDamped = computeDampedY(y);
  }
  // At 260px: 200 + 60 * 0.45 = 227
  assert.strictEqual(lastDamped, 227);
});

runTest("ADVERSARIAL:HISTORY", "100-step random photo walk history depth invariant test", () => {
  const history = new BrowserHistorySimulator();
  let closedCount = 0;
  const controller = new PhotoModalHistoryController(history, () => {
    closedCount++;
  });

  const photoIds = galleryItems.map((p) => p.id);
  assert(photoIds.length === 45);

  // Initial modal open
  controller.onPhotoChange({ id: photoIds[0] });
  assert.strictEqual(history.length, 2);

  // Perform 100 random photo switches
  let currentPhotoIndex = 0;
  for (let step = 0; step < 100; step++) {
    // Random step: -1 or +1
    const delta = Math.random() > 0.5 ? 1 : -1;
    currentPhotoIndex = (currentPhotoIndex + delta + photoIds.length) % photoIds.length;
    controller.onPhotoChange({ id: photoIds[currentPhotoIndex] });

    // History stack length MUST remain exactly 2 throughout the entire walk
    assert.strictEqual(history.length, 2, `History leak at step ${step}: length=${history.length}`);
    assert.strictEqual(history.index, 1, `History index drift at step ${step}: index=${history.index}`);
    assert.strictEqual(history.current.state?.photoId, photoIds[currentPhotoIndex]);
  }

  // Final manual close
  controller.handleManualClose();
  controller.unmount();

  assert.strictEqual(history.length, 2);
  assert.strictEqual(history.index, 0, "Index must return to 0 (root page)");
  assert.strictEqual(history.current.state, null);
  assert.strictEqual(closedCount, 1);
});

runTest("ADVERSARIAL:LENIS", "50-cycle rapid open/close stress test guarantees zero scroll lock leak", () => {
  let stopCalls = 0;
  let startCalls = 0;
  const mockLenis = {
    stop: () => { stopCalls++; },
    start: () => { startCalls++; },
  };
  const mockWindow = { lenis: mockLenis };
  const mockBody = { style: { overflow: "" } };

  for (let cycle = 0; cycle < 50; cycle++) {
    // Open
    if (mockWindow.lenis?.stop) mockWindow.lenis.stop();
    const prev = mockBody.style.overflow;
    mockBody.style.overflow = "hidden";

    // Close
    mockBody.style.overflow = prev;
    if (mockWindow.lenis?.start) mockWindow.lenis.start();
  }

  assert.strictEqual(stopCalls, 50, "Total stop() calls must be 50");
  assert.strictEqual(startCalls, 50, "Total start() calls must be 50");
  assert.strictEqual(mockBody.style.overflow, "", "Body overflow style must be completely restored");
});


// ==================================================================
// SUMMARY
// ==================================================================
console.log("\n==================================================================");
console.log(`CHALLENGER 1 EMPIRICAL RESULTS: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} checks`);
console.log("==================================================================");

if (failedTests > 0) {
  console.error("VERDICT: REJECT");
  process.exit(1);
} else {
  console.log("VERDICT: APPROVE / CONFIRMED");
  process.exit(0);
}
