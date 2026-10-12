import fs from "fs";
import path from "path";
import assert from "assert";

const root = process.cwd();

console.log("==================================================================");
console.log("CHALLENGER 1 EMPIRICAL VERIFICATION HARNESS");
console.log("Testing Assets, JPEG SOF Markers, Unicode Integrity & Masonry Math");
console.log("==================================================================\n");

// Dynamic import of gallery items and sections
const { galleryItems, gallerySections } = await import(path.join(root, "src/config/gallery.ts"));
assert(Array.isArray(gallerySections) && gallerySections.length === 4, "gallerySections must be 4 sections");

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

/**
 * Raw JPEG Parser to extract SOF markers (SOF0, SOF1, SOF2, etc.)
 * Markers:
 * 0xFFC0: Baseline DCT
 * 0xFFC1: Extended sequential DCT
 * 0xFFC2: Progressive DCT
 * 0xFFC3: Spatial lossless
 * 0xFFC5 .. 0xFFC7: Differential
 * 0xFFC9 .. 0xFFCB: Arithmetic
 * 0xFFCD .. 0xFFCF: Differential arithmetic
 */
function parseJpegHeaders(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 4 || buf[0] !== 0xFF || buf[1] !== 0xD8) {
    throw new Error(`File is not a valid JPEG (missing SOI marker 0xFFD8): ${filePath}`);
  }

  let offset = 2;
  const sofMarkers = [];

  while (offset < buf.length) {
    if (buf[offset] !== 0xFF) {
      // Find next 0xFF if padding or synchronization issue
      let nextFF = offset;
      while (nextFF < buf.length && buf[nextFF] !== 0xFF) {
        nextFF++;
      }
      if (nextFF >= buf.length) break;
      offset = nextFF;
    }

    // Skip fill bytes 0xFF
    while (offset < buf.length && buf[offset] === 0xFF) {
      offset++;
    }
    if (offset >= buf.length) break;

    const marker = buf[offset];
    offset++;

    // Standalone markers without length
    if (marker === 0xD8 || marker === 0xD9 || (marker >= 0xD0 && marker <= 0xD7)) {
      continue;
    }

    if (offset + 2 > buf.length) break;
    const length = buf.readUInt16BE(offset);

    // SOF Markers
    const isSOF = (
      (marker >= 0xC0 && marker <= 0xC3) ||
      (marker >= 0xC5 && marker <= 0xC7) ||
      (marker >= 0xC9 && marker <= 0xCB) ||
      (marker >= 0xCD && marker <= 0xCF)
    );

    if (isSOF) {
      if (offset + 7 > buf.length) {
        throw new Error(`Corrupted SOF segment in ${filePath}`);
      }
      const precision = buf[offset + 2];
      const height = buf.readUInt16BE(offset + 3);
      const width = buf.readUInt16BE(offset + 5);
      const numComponents = buf[offset + 7];
      sofMarkers.push({
        marker: `0x${marker.toString(16).toUpperCase()}`,
        markerCode: marker,
        precision,
        width,
        height,
        numComponents,
        offset: offset - 2,
        length
      });
    }

    // SOS (Start of Scan) marker 0xDA precedes compressed image data
    if (marker === 0xDA) {
      // After SOS, entropy data follows until EOI
      break;
    }

    offset += length;
  }

  return {
    fileSize: buf.length,
    sofMarkers
  };
}

// ===================================================================
// SUITE 1: Physical File Existence & Size Invariants (< 1.5MB)
// ===================================================================
console.log("--- SUITE 1: Physical Asset Audit (All 45 photos) ---");

runTest("ASSETS", "Catalog contains exactly 45 photo entries", () => {
  assert.strictEqual(galleryItems.length, 45, `Expected 45 items, found ${galleryItems.length}`);
});

runTest("ASSETS", "Photo IDs and src paths are unique across all 45 items", () => {
  const ids = new Set();
  const srcs = new Set();
  for (const item of galleryItems) {
    assert(!ids.has(item.id), `Duplicate ID found: ${item.id}`);
    assert(!srcs.has(item.src), `Duplicate src found: ${item.src}`);
    ids.add(item.id);
    srcs.add(item.src);
  }
});

const MAX_BYTES = 1.5 * 1024 * 1024; // 1,572,864 bytes
for (const item of galleryItems) {
  runTest("ASSET_SIZE", `Asset ${item.id} (${item.src}) exists, readable, < 1.5MB`, () => {
    const fullPath = path.join(root, "public", item.src);
    assert(fs.existsSync(fullPath), `File does not exist: ${fullPath}`);
    const stat = fs.statSync(fullPath);
    assert(stat.isFile(), `Target is not a regular file: ${fullPath}`);
    assert(stat.size > 0, `File is empty: ${fullPath}`);
    assert(
      stat.size < MAX_BYTES,
      `File exceeds 1.5MB: ${stat.size} bytes (${(stat.size / 1024 / 1024).toFixed(3)} MB)`
    );
  });
}

// ===================================================================
// SUITE 2: Raw JPEG Header Parsing & Dimension / Orientation Matches
// ===================================================================
console.log("\n--- SUITE 2: Raw JPEG SOF Marker & Dimension Parity ---");

for (const item of galleryItems) {
  runTest("JPEG_SOF", `Header parsing & dimension assertion for ${item.id}`, () => {
    const fullPath = path.join(root, "public", item.src);
    const parsed = parseJpegHeaders(fullPath);
    assert(parsed.sofMarkers.length > 0, `No SOF marker found in ${item.src}`);
    const primarySOF = parsed.sofMarkers[0];

    // Assert width match
    assert.strictEqual(
      primarySOF.width,
      item.width,
      `Width mismatch on ${item.id}: disk=${primarySOF.width}px vs config=${item.width}px`
    );

    // Assert height match
    assert.strictEqual(
      primarySOF.height,
      item.height,
      `Height mismatch on ${item.id}: disk=${primarySOF.height}px vs config=${item.height}px`
    );

    // Assert orientation calculation
    const calculatedOrientation = primarySOF.width > primarySOF.height ? "landscape" : "portrait";
    assert.strictEqual(
      item.orientation,
      calculatedOrientation,
      `Orientation mismatch on ${item.id}: disk calculated=${calculatedOrientation} vs config=${item.orientation}`
    );
  });
}

// ===================================================================
// SUITE 3: Byte-Exact Greek α (U+03B1) Camera Invariant
// ===================================================================
console.log("\n--- SUITE 3: Byte-Exact Greek α (U+03B1) Verification ---");

for (const item of galleryItems) {
  runTest("GREEK_ALPHA", `specs.camera byte-exactness for ${item.id}`, () => {
    const cam = item.specs.camera;
    assert.strictEqual(cam, "Sony α7 III", `Camera string must equal 'Sony α7 III' on ${item.id}`);

    // Byte & Codepoint inspection:
    // "Sony α7 III":
    // index 0: 'S' (U+0053)
    // index 1: 'o' (U+006F)
    // index 2: 'n' (U+006E)
    // index 3: 'y' (U+0079)
    // index 4: ' ' (U+0020)
    // index 5: 'α' (U+03B1)
    // index 6: '7' (U+0037)
    // index 7: ' ' (U+0020)
    // index 8: 'I' (U+0049)
    // index 9: 'I' (U+0049)
    // index 10: 'I' (U+0049)
    assert.strictEqual(cam.length, 11, `Expected string length 11, got ${cam.length}`);
    const codePointAt5 = cam.codePointAt(5);
    assert.strictEqual(
      codePointAt5,
      0x03B1,
      `Expected codepoint 0x03B1 at index 5, got 0x${codePointAt5.toString(16)}`
    );

    // Verify UTF-8 buffer representation
    const buf = Buffer.from(cam, "utf-8");
    // 'S' (0x53), 'o' (0x6f), 'n' (0x6e), 'y' (0x79), ' ' (0x20),
    // Greek α is encoded in UTF-8 as two bytes: 0xCE 0xB1
    // '7' (0x37), ' ' (0x20), 'I' (0x49), 'I' (0x49), 'I' (0x49)
    assert.strictEqual(buf[5], 0xCE, `Byte 5 must be 0xCE`);
    assert.strictEqual(buf[6], 0xB1, `Byte 6 must be 0xB1`);

    // Ensure NO Latin 'a' (0x61)
    assert(!buf.includes(0x61), `specs.camera contains Latin 'a' (0x61)`);
  });
}

// ===================================================================
// SUITE 4: Masonry Layout Math & Column Height Discrepancy (< 10%)
// ===================================================================
console.log("\n--- SUITE 4: Masonry Layout Math & Greedy Dual-Column Balance ---");

// Re-implement the exact algorithms from EditorialPhotobook.tsx
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

function simulateDualColumnMasonry(orderedPhotos, activeSection, limit = orderedPhotos.length) {
  const visible = orderedPhotos.slice(0, limit);
  let heightL = 0;
  let heightR = 0;
  const leftEntries = [];
  const rightEntries = [];

  const showEmbed = activeSection === "all" || activeSection === "tu-photo";
  let embedPlaced = false;

  visible.forEach((photo, idx) => {
    if (showEmbed && !embedPlaced && idx === 4) {
      embedPlaced = true;
      const embedAspect = 1.25;
      if (heightL <= heightR) {
        leftEntries.push({ type: "embed", aspect: embedAspect });
        heightL += embedAspect;
      } else {
        rightEntries.push({ type: "embed", aspect: embedAspect });
        heightR += embedAspect;
      }
    }

    const aspect = (photo.height || 1600) / (photo.width || 2400);
    if (heightL <= heightR) {
      leftEntries.push({ type: "photo", id: photo.id, aspect });
      heightL += aspect;
    } else {
      rightEntries.push({ type: "photo", id: photo.id, aspect });
      heightR += aspect;
    }
  });

  if (showEmbed && !embedPlaced && visible.length > 0) {
    const embedAspect = 1.25;
    if (heightL <= heightR) {
      leftEntries.push({ type: "embed", aspect: embedAspect });
      heightL += embedAspect;
    } else {
      rightEntries.push({ type: "embed", aspect: embedAspect });
      heightR += embedAspect;
    }
  }

  const maxHeight = Math.max(heightL, heightR);
  const minHeight = Math.min(heightL, heightR);
  const discrepancy = maxHeight === 0 ? 0 : (maxHeight - minHeight) / maxHeight;

  return {
    heightL,
    heightR,
    leftCount: leftEntries.length,
    rightCount: rightEntries.length,
    discrepancy,
    discrepancyPercent: (discrepancy * 100).toFixed(2) + "%"
  };
}

// Test All View at full capacity (all 45 photos)
runTest("MASONRY_MATH", "Dual-column height balance across full catalog (45 photos) < 10%", () => {
  const ordered = getOrderedPhotos(galleryItems, "all");
  assert.strictEqual(ordered.length, 45, `Ordered photos length must be 45, got ${ordered.length}`);
  const result = simulateDualColumnMasonry(ordered, "all", 45);
  console.log(`   [Metrics - All 45]: Height Left=${result.heightL.toFixed(3)}, Height Right=${result.heightR.toFixed(3)}, Discrepancy=${result.discrepancyPercent}`);
  assert(
    result.discrepancy < 0.10,
    `Full catalog height discrepancy exceeds 10%: ${result.discrepancyPercent}`
  );
});

// Test Progressive Batches (12, 24, 36, 45) for All Archive
const batches = [12, 24, 36, 45];
for (const b of batches) {
  runTest("MASONRY_PROGRESSIVE", `Batch size ${b} height discrepancy < 10%`, () => {
    const ordered = getOrderedPhotos(galleryItems, "all");
    const result = simulateDualColumnMasonry(ordered, "all", b);
    console.log(`   [Metrics - Batch ${b}]: Height Left=${result.heightL.toFixed(3)}, Height Right=${result.heightR.toFixed(3)}, Discrepancy=${result.discrepancyPercent}`);
    assert(
      result.discrepancy < 0.10,
      `Batch ${b} height discrepancy exceeds 10%: ${result.discrepancyPercent}`
    );
  });
}

// Test Individual Sections (personal, tu-photo, psctu)
const sections = ["personal", "tu-photo", "psctu"];
for (const s of sections) {
  runTest("MASONRY_SECTIONS", `Section '${s}' (15 photos) height discrepancy < 10%`, () => {
    const ordered = getOrderedPhotos(galleryItems, s);
    assert.strictEqual(ordered.length, 15, `Section '${s}' expected 15 items, got ${ordered.length}`);
    const result = simulateDualColumnMasonry(ordered, s, 15);
    console.log(`   [Metrics - Section ${s}]: Height Left=${result.heightL.toFixed(3)}, Height Right=${result.heightR.toFixed(3)}, Discrepancy=${result.discrepancyPercent}`);
    assert(
      result.discrepancy < 0.10,
      `Section '${s}' height discrepancy exceeds 10%: ${result.discrepancyPercent}`
    );
  });
}

// ===================================================================
// SUITE 5: Orientation Interleaving & Clustering Stress Test
// ===================================================================
console.log("\n--- SUITE 5: Bresenham Interleaving & Orientation Clustering ---");

runTest("INTERLEAVER", "Bresenham interleave preserves all items with zero loss and zero duplicates", () => {
  const ordered = getOrderedPhotos(galleryItems, "all");
  assert.strictEqual(ordered.length, 45, "Must retain 45 items");
  const uniqueIds = new Set(ordered.map((p) => p.id));
  assert.strictEqual(uniqueIds.size, 45, "Must retain 45 unique items without duplicates");
});

function analyzeClusters(photos) {
  let maxLandscapeRun = 0;
  let maxPortraitRun = 0;
  let currentRun = 0;
  let currentOrient = null;

  const runs = [];

  for (const p of photos) {
    if (p.orientation === currentOrient) {
      currentRun++;
    } else {
      if (currentOrient) {
        runs.push({ orientation: currentOrient, count: currentRun });
        if (currentOrient === "landscape" && currentRun > maxLandscapeRun) maxLandscapeRun = currentRun;
        if (currentOrient === "portrait" && currentRun > maxPortraitRun) maxPortraitRun = currentRun;
      }
      currentOrient = p.orientation;
      currentRun = 1;
    }
  }
  if (currentOrient) {
    runs.push({ orientation: currentOrient, count: currentRun });
    if (currentOrient === "landscape" && currentRun > maxLandscapeRun) maxLandscapeRun = currentRun;
    if (currentOrient === "portrait" && currentRun > maxPortraitRun) maxPortraitRun = currentRun;
  }

  return { maxLandscapeRun, maxPortraitRun, runs };
}

runTest("CLUSTERING", "All Archive orientation run lengths are smooth without large clusters", () => {
  const ordered = getOrderedPhotos(galleryItems, "all");
  const stats = analyzeClusters(ordered);
  const totalL = ordered.filter((p) => p.orientation === "landscape").length;
  const totalP = ordered.filter((p) => p.orientation === "portrait").length;
  console.log(`   [Cluster Analysis - All]: Landscapes=${totalL}, Portraits=${totalP}, Max L Run=${stats.maxLandscapeRun}, Max P Run=${stats.maxPortraitRun}`);
  console.log(`   Runs summary:`, stats.runs.map((r) => `${r.orientation[0].toUpperCase()}${r.count}`).join("-"));

  // Theoretical Bresenham bound: with ratio 30:15 (2:1), max landscape run is 2 (or 3 at boundaries), max portrait run is 1
  assert(stats.maxLandscapeRun <= 3, `Landscape run too long: ${stats.maxLandscapeRun}`);
  assert(stats.maxPortraitRun <= 2, `Portrait run too long: ${stats.maxPortraitRun}`);
});

for (const s of sections) {
  runTest("CLUSTERING", `Section '${s}' orientation run lengths are bounded`, () => {
    const ordered = getOrderedPhotos(galleryItems, s);
    const stats = analyzeClusters(ordered);
    const totalL = ordered.filter((p) => p.orientation === "landscape").length;
    const totalP = ordered.filter((p) => p.orientation === "portrait").length;
    console.log(`   [Cluster Analysis - ${s}]: L=${totalL}, P=${totalP}, Max L Run=${stats.maxLandscapeRun}, Max P Run=${stats.maxPortraitRun}`);
    console.log(`   Runs summary:`, stats.runs.map((r) => `${r.orientation[0].toUpperCase()}${r.count}`).join("-"));
    
    // Bounds check
    assert(stats.maxLandscapeRun <= 4, `Section ${s} landscape run too long: ${stats.maxLandscapeRun}`);
    assert(stats.maxPortraitRun <= 3, `Section ${s} portrait run too long: ${stats.maxPortraitRun}`);
  });
}

// ===================================================================
// FINAL HARNESS VERDICT
// ===================================================================
console.log("\n==================================================================");
console.log(`CHALLENGER 1 SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} checks`);
console.log("==================================================================");

if (failedTests > 0) {
  console.error("VERDICT: DISPROVEN (Integrity violations detected)");
  process.exit(1);
} else {
  console.log("VERDICT: CONFIRMED (All empirical assertions satisfied)");
  process.exit(0);
}
