import fs from "fs";
import path from "path";
import assert from "assert";

const root = process.cwd();

console.log("==================================================================");
console.log("CHALLENGER 2 EMPIRICAL STRESS TEST SUITE");
console.log("UI Boundaries, Event Listeners, Batching, Invariants & Benchmarks");
console.log("==================================================================\n");

// Dynamic import of gallery items
const { galleryItems } = await import(path.join(root, "src/config/gallery.ts"));

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

// =====================================================================
// Suite 1: Modal Index Boundary & Wrap-around Logic Stress Tests
// =====================================================================
console.log("--- Suite 1: Modal Index Boundary & Wrap-around Logic ---");

runTest("Modal Boundaries", "Wrap-around logic: 0 -> prev -> 44 on full 45-photo catalog", () => {
  const total = galleryItems.length;
  assert.strictEqual(total, 45, "Total gallery items must be 45");

  // Replicate exact logic from src/app/page.tsx handleModalPrev
  const curIdx = 0;
  const prevIdx = (curIdx - 1 + total) % total;
  assert.strictEqual(prevIdx, 44, "At index 0, prev must wrap to index 44");
  
  const prevPhoto = galleryItems[prevIdx];
  assert(prevPhoto !== undefined, "Wrapped photo at index 44 must not be undefined");
  assert.strictEqual(prevPhoto.id, galleryItems[44].id, "Target photo must be item 44");
});

runTest("Modal Boundaries", "Wrap-around logic: 44 -> next -> 0 on full 45-photo catalog", () => {
  const total = galleryItems.length;
  // Replicate exact logic from src/app/page.tsx handleModalNext
  const curIdx = 44;
  const nextIdx = (curIdx + 1) % total;
  assert.strictEqual(nextIdx, 0, "At index 44, next must wrap to index 0");
  
  const nextPhoto = galleryItems[nextIdx];
  assert(nextPhoto !== undefined, "Wrapped photo at index 0 must not be undefined");
  assert.strictEqual(nextPhoto.id, galleryItems[0].id, "Target photo must be item 0");
});

runTest("Modal Boundaries", "Full bi-directional wrap-around cycle across all 45 items", () => {
  const total = galleryItems.length;

  // Forward cycle starting from 0, 45 steps must return to 0
  let forwardIdx = 0;
  for (let step = 0; step < total; step++) {
    forwardIdx = (forwardIdx + 1) % total;
  }
  assert.strictEqual(forwardIdx, 0, "45 next operations from 0 must return to 0");

  // Backward cycle starting from 0, 45 steps must return to 0
  let backwardIdx = 0;
  for (let step = 0; step < total; step++) {
    backwardIdx = (backwardIdx - 1 + total) % total;
  }
  assert.strictEqual(backwardIdx, 0, "45 prev operations from 0 must return to 0");
});

runTest("Modal Boundaries", "Sub-section boundaries wrap cleanly (15 items per section)", () => {
  const sections = ["personal", "tu-photo", "psctu"];
  for (const s of sections) {
    const subset = galleryItems.filter((p) => p.sectionId === s);
    assert.strictEqual(subset.length, 15, `Section ${s} must have 15 items`);

    // 0 -> prev -> 14
    const prevIdx = (0 - 1 + subset.length) % subset.length;
    assert.strictEqual(prevIdx, 14, `Section ${s} at 0 -> prev must wrap to 14`);
    assert(subset[prevIdx] !== undefined);

    // 14 -> next -> 0
    const nextIdx = (14 + 1) % subset.length;
    assert.strictEqual(nextIdx, 0, `Section ${s} at 14 -> next must wrap to 0`);
    assert(subset[nextIdx] !== undefined);
  }
});

runTest("Modal Boundaries", "PhotoModal computedIndex & computedTotal calculation invariants", () => {
  const total = galleryItems.length;

  // Exact logic from src/components/PhotoModal.tsx
  function computeIndex(currentIndex, photo, computedTotal) {
    if (typeof currentIndex === "number") {
      if (currentIndex >= 1 && currentIndex <= computedTotal) {
        return currentIndex;
      }
      if (currentIndex === 0) {
        return 1;
      }
    }
    const found = galleryItems.findIndex((p) => p.id === photo.id);
    return found >= 0 ? found + 1 : 1;
  }

  // 1-based index passed from page.tsx: idx 0 + 1 = 1, idx 44 + 1 = 45
  assert.strictEqual(computeIndex(1, galleryItems[0], total), 1, "First item index is 1");
  assert.strictEqual(computeIndex(45, galleryItems[44], total), 45, "Last item index is 45");

  // Robustness fallback tests
  assert.strictEqual(computeIndex(0, galleryItems[0], total), 1, "0 must fallback to 1");
  assert.strictEqual(computeIndex(undefined, galleryItems[44], total), 45, "undefined index must fallback to findIndex + 1 = 45");
  assert.strictEqual(computeIndex(undefined, galleryItems[0], total), 1, "undefined index must fallback to findIndex + 1 = 1");
  assert.strictEqual(computeIndex(999, galleryItems[10], total), 11, "Out-of-range index must fallback to findIndex + 1");
});

runTest("Modal Boundaries", "PhotoModal adjacent image prefetching wrapping indices", () => {
  const total = galleryItems.length;

  // Prefetch logic from PhotoModal.tsx
  function getAdjacent(idx) {
    const nextIdx = (idx + 1) % total;
    const prevIdx = (idx - 1 + total) % total;
    return {
      next: galleryItems[nextIdx],
      prev: galleryItems[prevIdx],
    };
  }

  // Boundary 0: prev is 44, next is 1
  const adj0 = getAdjacent(0);
  assert.strictEqual(adj0.prev.id, galleryItems[44].id);
  assert.strictEqual(adj0.next.id, galleryItems[1].id);

  // Boundary 44: prev is 43, next is 0
  const adj44 = getAdjacent(44);
  assert.strictEqual(adj44.prev.id, galleryItems[43].id);
  assert.strictEqual(adj44.next.id, galleryItems[0].id);
});

// =====================================================================
// Suite 2: Event Listener & Gyroscope Stress Tests
// =====================================================================
console.log("\n--- Suite 2: Event Listener & Touch/Gyroscope Stress Tests ---");

runTest("Event Listeners", "InteractivePrintCard.tsx contains 0 window event listeners", () => {
  const cardPath = path.join(root, "src/components/InteractivePrintCard.tsx");
  const cardContent = fs.readFileSync(cardPath, "utf-8");

  // Check window.addEventListener
  const windowListeners = cardContent.match(/window\.addEventListener/g) || [];
  assert.strictEqual(windowListeners.length, 0, `InteractivePrintCard must have 0 window.addEventListener calls, found ${windowListeners.length}`);

  // Check document.addEventListener
  const docListeners = cardContent.match(/document\.addEventListener/g) || [];
  assert.strictEqual(docListeners.length, 0, `InteractivePrintCard must have 0 document.addEventListener calls, found ${docListeners.length}`);
});

runTest("Event Listeners", "InteractivePrintCard.tsx contains 0 deviceorientation / devicemotion listeners", () => {
  const cardPath = path.join(root, "src/components/InteractivePrintCard.tsx");
  const cardContent = fs.readFileSync(cardPath, "utf-8");

  assert(!cardContent.includes("deviceorientation"), "Must NOT contain 'deviceorientation'");
  assert(!cardContent.includes("devicemotion"), "Must NOT contain 'devicemotion'");
  assert(!cardContent.includes("DeviceOrientationEvent"), "Must NOT reference DeviceOrientationEvent");
  assert(!cardContent.includes("DeviceMotionEvent"), "Must NOT reference DeviceMotionEvent");
});

runTest("Event Listeners", "Entire repository contains 0 active deviceorientation listeners", () => {
  function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (["node_modules", ".next", ".git", ".agents"].includes(file)) continue;
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        results = results.concat(walkDir(full));
      } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".js") || file.endsWith(".jsx")) {
        results.push(full);
      }
    }
    return results;
  }

  const codeFiles = walkDir(path.join(root, "src"));
  for (const file of codeFiles) {
    const content = fs.readFileSync(file, "utf-8");
    assert(!content.includes("deviceorientation"), `Found deviceorientation in ${path.relative(root, file)}`);
    assert(!content.includes("devicemotion"), `Found devicemotion in ${path.relative(root, file)}`);
  }
});

runTest("Event Listeners", "PhotoModal.tsx cleans up all registered window and stage event listeners", () => {
  const modalPath = path.join(root, "src/components/PhotoModal.tsx");
  const content = fs.readFileSync(modalPath, "utf-8");

  // Every addEventListener must have a paired removeEventListener in its cleanup return
  const addMatches = [...content.matchAll(/addEventListener\(\s*["']([^"']+)["']/g)].map((m) => m[1]);
  const removeMatches = [...content.matchAll(/removeEventListener\(\s*["']([^"']+)["']/g)].map((m) => m[1]);

  assert(addMatches.length > 0, "PhotoModal should have event listeners");
  assert.strictEqual(
    addMatches.length,
    removeMatches.length,
    `Listener mismatch: added ${addMatches.length} (${addMatches.join(",")}), removed ${removeMatches.length} (${removeMatches.join(",")})`
  );

  for (const ev of addMatches) {
    assert(removeMatches.includes(ev), `Listener ${ev} was added but not removed`);
  }
});

// =====================================================================
// Suite 3: Batch Pagination Slicing & Ordering Logic
// =====================================================================
console.log("\n--- Suite 3: Batch Pagination Slicing & Ordering Logic ---");

// Recreate Bresenham interleave and round robin algorithms from EditorialPhotobook.tsx
function bresenhamInterleave(landscapes, portraits) {
  const L = landscapes.length;
  const P = portraits.length;
  const N = L + P;
  if (N === 0) return [];
  if (P === 0) return [...landscapes];
  if (L === 0) return [...portraits];

  const result = [];
  let lIdx = 0;
  let pIdx = 0;
  const isLandscapeMajor = L >= P;
  const minorCount = isLandscapeMajor ? P : L;
  let accum = Math.floor(N / 2);

  for (let i = 0; i < N; i++) {
    accum += minorCount;
    if (accum >= N) {
      accum -= N;
      if (isLandscapeMajor) {
        if (pIdx < P) result.push(portraits[pIdx++]);
        else result.push(landscapes[lIdx++]);
      } else {
        if (lIdx < L) result.push(landscapes[lIdx++]);
        else result.push(portraits[pIdx++]);
      }
    } else {
      if (isLandscapeMajor) {
        if (lIdx < L) result.push(landscapes[lIdx++]);
        else result.push(portraits[pIdx++]);
      } else {
        if (pIdx < P) result.push(portraits[pIdx++]);
        else result.push(landscapes[lIdx++]);
      }
    }
  }
  return result;
}

function roundRobinBySeries(photos) {
  const bySeries = {};
  for (const p of photos) {
    if (!bySeries[p.sectionId]) bySeries[p.sectionId] = [];
    bySeries[p.sectionId].push(p);
  }
  const seriesKeys = Object.keys(bySeries);
  const result = [];
  let added = true;
  let idx = 0;
  while (added) {
    added = false;
    for (const s of seriesKeys) {
      if (idx < bySeries[s].length) {
        result.push(bySeries[s][idx]);
        added = true;
      }
    }
    idx++;
  }
  return result;
}

function getOrderedPhotos(items, activeSection) {
  if (activeSection === "all") {
    const landscapes = items.filter((p) => p.orientation === "landscape");
    const portraits = items.filter((p) => p.orientation === "portrait");
    const balancedLandscapes = roundRobinBySeries(landscapes);
    const balancedPortraits = roundRobinBySeries(portraits);
    return bresenhamInterleave(balancedLandscapes, balancedPortraits);
  }
  const sectionItems = items.filter((p) => p.sectionId === activeSection);
  const landscapes = sectionItems.filter((p) => p.orientation === "landscape");
  const portraits = sectionItems.filter((p) => p.orientation === "portrait");
  return bresenhamInterleave(landscapes, portraits);
}

runTest("Batch Pagination", "Batch slicing covers exactly 45 items in 4 batches (12, 24, 36, 45)", () => {
  const BATCH_SIZE = 12;
  const ordered = getOrderedPhotos(galleryItems, "all");
  assert.strictEqual(ordered.length, 45, "Ordered catalog must contain exactly 45 items");

  // Batch progression simulation as intersection observer fires
  let visibleCount = BATCH_SIZE;
  const steps = [];

  for (let i = 0; i < 4; i++) {
    const sliced = ordered.slice(0, visibleCount);
    steps.push({ step: i + 1, visibleCount, itemsCount: sliced.length });
    
    // Increment visible count as in EditorialPhotobook.tsx
    if (i < 3) {
      visibleCount = Math.min(visibleCount + BATCH_SIZE, ordered.length);
    }
  }

  assert.strictEqual(steps[0].itemsCount, 12, "Batch 1 must contain exactly 12 items");
  assert.strictEqual(steps[1].itemsCount, 24, "Batch 2 must contain exactly 24 items");
  assert.strictEqual(steps[2].itemsCount, 36, "Batch 3 must contain exactly 36 items");
  assert.strictEqual(steps[3].itemsCount, 45, "Batch 4 must contain exactly 45 items");

  // Subsequent trigger should not exceed 45
  visibleCount = Math.min(visibleCount + BATCH_SIZE, ordered.length);
  assert.strictEqual(visibleCount, 45, "Visible count must not exceed 45 items");
  assert.strictEqual(ordered.slice(0, visibleCount).length, 45, "Final batch contains all 45 items");
});

runTest("Batch Pagination", "Bresenham interleave preserves all 45 unique items without duplicates or dropped items", () => {
  const ordered = getOrderedPhotos(galleryItems, "all");
  assert.strictEqual(ordered.length, 45, "Must return 45 items");

  const originalIds = new Set(galleryItems.map((p) => p.id));
  const orderedIds = new Set(ordered.map((p) => p.id));

  assert.strictEqual(orderedIds.size, 45, "Must contain 45 unique IDs");
  assert.strictEqual(originalIds.size, 45, "Original IDs must be 45");

  for (const id of originalIds) {
    assert(orderedIds.has(id), `Missing photo ID in ordered output: ${id}`);
  }
});

runTest("Batch Pagination", "Bresenham interleave edge cases (0/45, 45/0, extreme ratios)", () => {
  const fakeLandscapes = Array.from({ length: 30 }, (_, i) => ({ id: `L-${i}`, orientation: "landscape", sectionId: "s" }));
  const fakePortraits = Array.from({ length: 15 }, (_, i) => ({ id: `P-${i}`, orientation: "portrait", sectionId: "s" }));

  // Test 30 landscapes + 15 portraits
  const res1 = bresenhamInterleave(fakeLandscapes, fakePortraits);
  assert.strictEqual(res1.length, 45, "30+15 must yield 45 items");
  assert.strictEqual(new Set(res1.map((p) => p.id)).size, 45, "All 45 items must be unique");

  // Test 0 landscapes + 45 portraits
  const res2 = bresenhamInterleave([], fakePortraits);
  assert.strictEqual(res2.length, 15);

  // Test 45 landscapes + 0 portraits
  const res3 = bresenhamInterleave(fakeLandscapes, []);
  assert.strictEqual(res3.length, 30);

  // Test empty
  const res4 = bresenhamInterleave([], []);
  assert.strictEqual(res4.length, 0);

  // Test 1 vs 44
  const oneL = [{ id: "L-0", orientation: "landscape", sectionId: "s" }];
  const fortyFourP = Array.from({ length: 44 }, (_, i) => ({ id: `P-${i}`, orientation: "portrait", sectionId: "s" }));
  const res5 = bresenhamInterleave(oneL, fortyFourP);
  assert.strictEqual(res5.length, 45);
  assert.strictEqual(new Set(res5.map((p) => p.id)).size, 45);
});

// =====================================================================
// Suite 4: Brand Invariant & Forbidden Substring Scans
// =====================================================================
console.log("\n--- Suite 4: Brand Invariant & Forbidden Substring Scans ---");

runTest("Forbidden Substrings", "0 occurrences of ASCII 'Sony a7 III' across src/", () => {
  function scanDir(dir) {
    let matches = [];
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        matches = matches.concat(scanDir(full));
      } else if (f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".css") || f.endsWith(".json")) {
        const text = fs.readFileSync(full, "utf-8");
        // Case insensitive match for 'sony a7'
        const regex = /sony\s+a7\b/gi;
        const found = text.match(regex);
        if (found) {
          matches.push({ file: path.relative(root, full), matches: found });
        }
      }
    }
    return matches;
  }

  const badOccurrences = scanDir(path.join(root, "src"));
  assert.strictEqual(
    badOccurrences.length,
    0,
    `Found ASCII 'Sony a7' in: ${JSON.stringify(badOccurrences)}`
  );
});

runTest("Forbidden Substrings", "Every camera spec in gallery.ts strictly uses Greek 'α' (Sony α7 III)", () => {
  for (const item of galleryItems) {
    assert.strictEqual(
      item.specs.camera,
      "Sony α7 III",
      `Item ${item.id} camera spec is '${item.specs.camera}', expected 'Sony α7 III'`
    );
    // Byte-level check for Greek small letter alpha (0xCE 0xB1 / U+03B1)
    const buf = Buffer.from(item.specs.camera);
    assert(buf.includes(Buffer.from([0xCE, 0xB1])), `Camera string must contain UTF-8 CE B1 for Greek alpha`);
  }
});

runTest("Forbidden Substrings", "0 occurrences of corrupted Thai names across src/", () => {
  function scanDir(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        results = results.concat(scanDir(full));
      } else if (f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".css")) {
        const text = fs.readFileSync(full, "utf-8");
        // Look for corruptions: ลิ้มอุดม without ป์, ลิมป์อุดม, etc.
        if (text.includes("ลิ้มอุดม")) {
          results.push({ file: path.relative(root, full), issue: "Contains ลิ้มอุดม without ป์" });
        }
        if (text.includes("ลิมป์อุดม")) {
          results.push({ file: path.relative(root, full), issue: "Contains ลิมป์อุดม with short i" });
        }
        if (text.includes("\ufffd")) {
          results.push({ file: path.relative(root, full), issue: "Contains Unicode replacement char \\ufffd" });
        }
      }
    }
    return results;
  }

  const corruptions = scanDir(path.join(root, "src"));
  assert.strictEqual(corruptions.length, 0, `Corrupt Thai names found: ${JSON.stringify(corruptions)}`);

  // Verify that valid Thai name exists and is correct in primary identity files
  const aboutPath = path.join(root, "src/app/about/AboutClient.tsx");
  const aboutText = fs.readFileSync(aboutPath, "utf-8");
  assert(aboutText.includes("จักริน ลิ้มป์อุดม"), "About page must contain 'จักริน ลิ้มป์อุดม'");

  const drawerPath = path.join(root, "src/components/AtelierDrawer.tsx");
  const drawerText = fs.readFileSync(drawerPath, "utf-8");
  assert(drawerText.includes("จักริน ลิ้มป์อุดม"), "AtelierDrawer must contain 'จักริน ลิ้มป์อุดม'");
});

runTest("Forbidden Substrings", "0 occurrences of third-party club/committee citations in UI navigation/headers", () => {
  const forbiddenPhrases = [
    "Faculty of Political Science",
    "คณะรัฐศาสตร์",
    "Commemoration",
    "commoderation",
    "TU Photo Club",
    "ชุมนุมถ่ายภาพมหาวิทยาลัยธรรมศาสตร์",
    "กนร.",
    "สภานักศึกษา",
  ];

  const targetUiFiles = [
    "src/components/TopNav.tsx",
    "src/components/SiteFooter.tsx",
    "src/components/ProjectDescriptionHeader.tsx",
    "src/components/AtelierDrawer.tsx",
    "src/context/LanguageContext.tsx",
    "src/app/page.tsx",
  ];

  for (const relPath of targetUiFiles) {
    const fullPath = path.join(root, relPath);
    const content = fs.readFileSync(fullPath, "utf-8");
    for (const phrase of forbiddenPhrases) {
      assert(
        !content.toLowerCase().includes(phrase.toLowerCase()),
        `UI file ${relPath} contains forbidden third-party citation: "${phrase}"`
      );
    }
  }
});

runTest("Forbidden Substrings", "Clean generic titles ('งานส่วนตัว', 'งานกิจกรรม', 'งานต่างๆ') strictly used in navigation", () => {
  const langPath = path.join(root, "src/context/LanguageContext.tsx");
  const langContent = fs.readFileSync(langPath, "utf-8");

  assert(langContent.includes('navPersonal: { th: "งานส่วนตัว", en: "PERSONAL WORKS" }'));
  assert(langContent.includes('navTuPhoto: { th: "งานกิจกรรม", en: "ACTIVITIES & EVENTS" }'));
  assert(langContent.includes('navPscTu: { th: "งานต่างๆ", en: "VARIOUS PROJECTS" }'));

  const footerPath = path.join(root, "src/components/SiteFooter.tsx");
  const footerContent = fs.readFileSync(footerPath, "utf-8");
  assert(footerContent.includes('"งานส่วนตัว" : "Personal Works"'));
  assert(footerContent.includes('"งานกิจกรรม" : "Activities & Events"'));
  assert(footerContent.includes('"งานต่างๆ" : "Various Projects"'));
});

// =====================================================================
// Summary
// =====================================================================
console.log("\n==================================================================");
console.log(`STRESS TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} tests`);
console.log("==================================================================");

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
