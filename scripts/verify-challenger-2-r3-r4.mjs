import fs from "fs";
import path from "path";
import assert from "assert";

const root = process.cwd();

console.log("==================================================================");
console.log("CHALLENGER 2 EMPIRICAL TEST SUITE: R3 PRIVACY & R4 VERIFICATION");
console.log("==================================================================\n");

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(title, fn) {
  totalChecks++;
  try {
    fn();
    console.log(`[PASS] ${title}`);
    passedChecks++;
  } catch (err) {
    console.error(`[FAIL] ${title}`);
    console.error(`       Error: ${err.message}`);
    failedChecks++;
  }
}

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === "node_modules" || item === ".git") continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, fileList);
    } else {
      fileList.push(full);
    }
  }
  return fileList;
}

// -------------------------------------------------------------
// Suite 1: Build Inspection & Email Privacy
// -------------------------------------------------------------
console.log("--- Suite 1: Build Inspection & Email Privacy ---");

check("Build output directory .next exists and has static chunks", () => {
  assert(fs.existsSync(path.join(root, ".next")), ".next directory must exist");
  assert(fs.existsSync(path.join(root, ".next/static/chunks")), ".next/static/chunks must exist");
  const chunks = fs.readdirSync(path.join(root, ".next/static/chunks"));
  assert(chunks.length > 0, "There must be static chunks generated");
});

check("Scan .next/static/chunks/ for occurrences of plain text 'contact.chakarin@gmail.com'", () => {
  const chunks = walkDir(path.join(root, ".next/static/chunks"));
  const leakedChunks = [];
  for (const chunk of chunks) {
    const content = fs.readFileSync(chunk, "utf-8");
    if (content.includes("contact.chakarin@gmail.com")) {
      leakedChunks.push(path.relative(root, chunk));
    }
  }
  // REQUIREMENT R3: Raw email must NOT leak into client static bundles
  assert.strictEqual(
    leakedChunks.length,
    0,
    `Plain text email found in client chunks: ${leakedChunks.join(", ")}`
  );
});

check("Scan static HTML export (.next/server/app/**/*.html) for raw email", () => {
  const serverFiles = walkDir(path.join(root, ".next/server/app"));
  const htmlFiles = serverFiles.filter((f) => f.endsWith(".html"));
  const leakedHtml = [];
  for (const f of htmlFiles) {
    const content = fs.readFileSync(f, "utf-8");
    if (content.includes("contact.chakarin@gmail.com")) {
      leakedHtml.push(path.relative(root, f));
    }
  }
  assert.strictEqual(
    leakedHtml.length,
    0,
    `Plain text email found in static HTML export: ${leakedHtml.join(", ")}`
  );
});

check("Scan React Server Component (RSC) payloads (.next/server/app/**/*.rsc) for raw email", () => {
  const serverFiles = walkDir(path.join(root, ".next/server/app"));
  const rscFiles = serverFiles.filter((f) => f.endsWith(".rsc"));
  const leakedRsc = [];
  for (const f of rscFiles) {
    const content = fs.readFileSync(f, "utf-8");
    if (content.includes("contact.chakarin@gmail.com")) {
      leakedRsc.push(path.relative(root, f));
    }
  }
  assert.strictEqual(
    leakedRsc.length,
    0,
    `Plain text email found in RSC payloads: ${leakedRsc.join(", ")}`
  );
});

// -------------------------------------------------------------
// Suite 2: Invariants Inspection
// -------------------------------------------------------------
console.log("\n--- Suite 2: System Invariants Inspection ---");

check("Sony camera spec invariant: 0 occurrences of ASCII 'Sony a7 III' or 'Sony A7 III' across src/", () => {
  const srcFiles = walkDir(path.join(root, "src"));
  const asciiMatches = [];
  const latinRegex = /Sony\s+a7\s*III/i;
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (latinRegex.test(content)) {
      asciiMatches.push(path.relative(root, file));
    }
  }
  assert.strictEqual(
    asciiMatches.length,
    0,
    `Found ASCII 'Sony a7 III' in: ${asciiMatches.join(", ")}`
  );
});

check("Sony camera spec invariant: strictly Greek lowercase 'α' (U+03B1) used across catalog", async () => {
  const { galleryItems, siteProfile } = await import(path.join(root, "src/config/gallery.ts"));
  assert.strictEqual(galleryItems.length, 45, "Catalog count must be 45");
  for (const item of galleryItems) {
    assert.strictEqual(
      item.specs.camera,
      "Sony α7 III",
      `Item ${item.id} camera must strictly be 'Sony α7 III'`
    );
    assert(
      item.specs.camera.includes("\u03B1"),
      `Item ${item.id} camera must contain Greek lowercase α (\\u03B1)`
    );
  }
  assert.strictEqual(siteProfile.gear.system, "Sony α7 III");
  assert(siteProfile.gear.system.includes("\u03B1"));
});

check("Thai name invariant: strictly 'จักริน ลิ้มป์อุดม' with 'ป์' across src/", () => {
  const srcFiles = walkDir(path.join(root, "src"));
  const corruptMatches = [];
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (content.includes("จักริน")) {
      // Check for missing ป์
      if (content.includes("ลิ้มอุดม") && !content.includes("ลิ้มป์อุดม")) {
        corruptMatches.push(path.relative(root, file));
      }
    }
  }
  assert.strictEqual(
    corruptMatches.length,
    0,
    `Found corrupted Thai name (missing ป์) in: ${corruptMatches.join(", ")}`
  );
});

check("Tagline invariant: strictly 'Photographer based in Bangkok'", () => {
  const filesToCheck = [
    "src/context/LanguageContext.tsx",
    "src/app/layout.tsx",
    "src/app/about/AboutClient.tsx",
    "src/config/gallery.ts",
  ];
  for (const rel of filesToCheck) {
    const full = path.join(root, rel);
    assert(fs.existsSync(full), `${rel} must exist`);
    const content = fs.readFileSync(full, "utf-8");
    assert(
      content.includes("Photographer based in Bangkok"),
      `${rel} must contain invariant 'Photographer based in Bangkok'`
    );
  }
});

check("Secret date / birthday invariant: never displayed in UI", () => {
  const overlayPath = path.join(root, "src/components/CountdownOverlay.tsx");
  assert(fs.existsSync(overlayPath), "CountdownOverlay.tsx must exist");
  const overlayCode = fs.readFileSync(overlayPath, "utf-8");

  // Verify that the UI labels do NOT include "วันเกิด", "Birthday", or raw date strings
  // In the JSX return block:
  const jsxStartIndex = overlayCode.indexOf("return (");
  assert(jsxStartIndex > 0, "JSX return statement must exist");
  const jsxBlock = overlayCode.substring(jsxStartIndex);

  assert(!jsxBlock.includes("วันเกิด"), "UI must NOT display 'วันเกิด'");
  assert(!jsxBlock.includes("Birthday"), "UI must NOT display 'Birthday'");
  assert(!jsxBlock.includes("22 October"), "UI must NOT display '22 October'");
  assert(!jsxBlock.includes("2026-10-22"), "UI must NOT display '2026-10-22'");
  assert(!jsxBlock.includes("20:15"), "UI must NOT display '20:15'");
  assert(jsxBlock.includes("Coming Soon"), "UI must show generic 'Coming Soon'");
});

// -------------------------------------------------------------
// Suite 3: Caching & Security Configuration
// -------------------------------------------------------------
console.log("\n--- Suite 3: Caching & Security Configuration ---");

check("vercel.json headers: Security headers configured", () => {
  const vPath = path.join(root, "vercel.json");
  assert(fs.existsSync(vPath), "vercel.json must exist");
  const cfg = JSON.parse(fs.readFileSync(vPath, "utf-8"));
  const globalHeader = cfg.headers.find((h) => h.source === "/(.*)");
  assert(globalHeader, "Global header rule /(.*) must exist");

  const headerKeys = globalHeader.headers.reduce((acc, h) => {
    acc[h.key] = h.value;
    return acc;
  }, {});

  assert.strictEqual(headerKeys["X-Content-Type-Options"], "nosniff");
  assert.strictEqual(headerKeys["X-Frame-Options"], "DENY");
  assert.strictEqual(headerKeys["X-XSS-Protection"], "1; mode=block");
  assert.strictEqual(headerKeys["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert(headerKeys["Permissions-Policy"].includes("camera=()"));
});

check("vercel.json headers: /photos/(.*) immutable 1-year cache configured", () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf-8"));
  const photoHeader = cfg.headers.find((h) => h.source === "/photos/(.*)");
  assert(photoHeader, "Photo cache header rule /photos/(.*) must exist");
  const cc = photoHeader.headers.find((h) => h.key === "Cache-Control");
  assert(cc, "Cache-Control header must exist for /photos/(.*)");
  assert.strictEqual(cc.value, "public, max-age=31536000, immutable");
});

check("next.config.ts: images unoptimized set to true", () => {
  const code = fs.readFileSync(path.join(root, "next.config.ts"), "utf-8");
  assert(/unoptimized:\s*true/.test(code), "next.config.ts must set images.unoptimized: true");
});

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log("\n==================================================================");
console.log(`TOTAL CHECKS: ${totalChecks}`);
console.log(`PASSED: ${passedChecks}`);
console.log(`FAILED: ${failedChecks}`);
console.log("==================================================================");

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
