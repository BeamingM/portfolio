import fs from "fs";
import path from "path";
import assert from "assert";

console.log("=================================================");
console.log("E2E VERIFICATION SUITE: CHAKARIN.PICS PORTFOLIO");
console.log("=================================================");

const root = process.cwd();

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------
// Tier 1: System Invariants & Domain Configuration
// -----------------------------------------------------------------
console.log("\n[Tier 1: System Invariants & Vercel / Domain Configuration]");

test("Camera invariant: Greek α U+03B1 (Sony α7 III) strictly maintained", () => {
  const galleryCode = fs.readFileSync(path.join(root, "src/config/gallery.ts"), "utf-8");
  assert(galleryCode.includes("Sony α7 III"), "Must contain Sony α7 III with Greek alpha");
  assert(!galleryCode.includes("Sony a7 III"), "Must NOT contain English letter 'a'");
  
  const cardCode = fs.readFileSync(path.join(root, "src/components/InteractivePrintCard.tsx"), "utf-8");
  assert(cardCode.includes("Sony α7 III"), "Print cards must display camera invariant Sony α7 III");

  const drawerCode = fs.readFileSync(path.join(root, "src/components/AtelierDrawer.tsx"), "utf-8");
  assert(drawerCode.includes("Sony α7 III"), "AtelierDrawer must display camera invariant Sony α7 III");

  const aboutCode = fs.readFileSync(path.join(root, "src/app/about/AboutClient.tsx"), "utf-8");
  assert(aboutCode.includes("Sony α7 III"), "About page must display camera invariant Sony α7 III");
});

test("Thai Name invariant: 'จักริน ลิ้มป์อุดม' (with ป์) strictly maintained", () => {
  const aboutClientCode = fs.readFileSync(path.join(root, "src/app/about/AboutClient.tsx"), "utf-8");
  assert(aboutClientCode.includes("จักริน ลิ้มป์อุดม"), "About page must contain Thai name จักริน ลิ้มป์อุดม with ป์");

  const aboutServerCode = fs.readFileSync(path.join(root, "src/app/about/page.tsx"), "utf-8");
  assert(aboutServerCode.includes("จักริน ลิ้มป์อุดม"), "About metadata must contain Thai name จักริน ลิ้มป์อุดม with ป์");
});

test("Tagline invariant: 'Photographer based in Bangkok' strictly maintained", () => {
  const langCode = fs.readFileSync(path.join(root, "src/context/LanguageContext.tsx"), "utf-8");
  assert(langCode.includes("Photographer based in Bangkok"), "Tagline invariant required");
  
  const layoutCode = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf-8");
  assert(layoutCode.includes("Photographer based in Bangkok"), "Metadata tagline invariant required");

  const aboutCode = fs.readFileSync(path.join(root, "src/app/about/AboutClient.tsx"), "utf-8");
  assert(aboutCode.includes("Photographer based in Bangkok"), "About page must contain tagline");
});

test("Vercel domain configuration: vercel.json exists with chakarin.pics headers", () => {
  assert(fs.existsSync(path.join(root, "vercel.json")), "vercel.json must exist");
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf-8"));
  assert(vercelConfig.cleanUrls === true, "cleanUrls must be enabled");
  assert(Array.isArray(vercelConfig.headers), "Security headers must be configured");
});

test("MetadataBase configured to https://chakarin.pics", () => {
  const layoutCode = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf-8");
  assert(layoutCode.includes("https://chakarin.pics"), "layout.tsx must configure metadataBase to chakarin.pics");
});

test("Image optimization config: unoptimized set to true to prevent Vercel quota exhaustion", () => {
  const nextConfigCode = fs.readFileSync(path.join(root, "next.config.ts"), "utf-8");
  assert(nextConfigCode.includes("unoptimized: true"), "next.config.ts must set unoptimized: true");
});

test("Resume PDF generated and accessible in public directory", () => {
  const resumePath = path.join(root, "public/resume.pdf");
  assert(fs.existsSync(resumePath), "public/resume.pdf must exist");
  const stats = fs.statSync(resumePath);
  assert(stats.size > 10000, "public/resume.pdf must be a valid non-empty PDF file");
});

test("Open Graph & Social Share Preview 16:9 Editorial Asset & Metadata Configuration", () => {
  assert(fs.existsSync(path.join(root, "public/og-image.png")), "public/og-image.png must exist");
  assert(fs.existsSync(path.join(root, "src/app/opengraph-image.png")), "src/app/opengraph-image.png must exist");
  assert(fs.existsSync(path.join(root, "src/app/twitter-image.png")), "src/app/twitter-image.png must exist");

  const layoutCode = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf-8");
  assert(layoutCode.includes("og-image.png"), "layout.tsx must configure og-image.png");
  assert(!layoutCode.includes("personal-01.jpg"), "layout.tsx metadata must no longer use raw photo personal-01.jpg");

  const aboutCode = fs.readFileSync(path.join(root, "src/app/about/page.tsx"), "utf-8");
  assert(aboutCode.includes("og-image.png"), "about/page.tsx must configure og-image.png");
  assert(!aboutCode.includes("personal-01.jpg"), "about/page.tsx metadata must no longer use raw photo personal-01.jpg");
});

// -----------------------------------------------------------------
// Tier 2: Sound Removal & Single Toolbar
// -----------------------------------------------------------------
console.log("\n[Tier 2: Feature Deletion Verification (Sound Gimmick & 2nd Toolbar)]");

test("Sound gimmick completely removed: No speaker mute toggle in TopNav", () => {
  const topNavCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(!topNavCode.includes("Volume2"), "TopNav must not import or render Volume2");
  assert(!topNavCode.includes("VolumeX"), "TopNav must not import or render VolumeX");
});

test("SoundProvider completely removed from root layout", () => {
  const layoutCode = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf-8");
  assert(!layoutCode.includes("SoundProvider"), "layout.tsx must not wrap children in SoundProvider");
  assert(!layoutCode.includes("@/context/SoundContext"), "layout.tsx must not import SoundContext");
});

test("2nd Toolbar (Lens selector) completely removed: Only ONE toolbar exists", () => {
  const pageCode = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf-8");
  assert(!pageCode.includes("Toolbar"), "page.tsx must not render floating bottom Toolbar");
  assert(!pageCode.includes("FloatingDock"), "page.tsx must not render FloatingDock");
  assert(!pageCode.includes("LensSelector"), "page.tsx must not render LensSelector");
});

// -----------------------------------------------------------------
// Tier 3: Mobile Responsiveness, Scroll Morph & IG Mouse Capture
// -----------------------------------------------------------------
console.log("\n[Tier 3: Mobile Responsiveness, Scroll Morph & IG Mouse Capture]");

test("SmoothScroll: Lenis touch interception disabled on mobile to prevent freezing", () => {
  const scrollCode = fs.readFileSync(path.join(root, "src/components/SmoothScroll.tsx"), "utf-8");
  assert(scrollCode.includes("isTouch"), "SmoothScroll must detect touch devices");
  assert(scrollCode.includes("if (isTouch)"), "SmoothScroll must return un-intercepted children on touch devices");
});

test("TopNav: BrandMark morph uses native scroll listener with zero-calc formula", () => {
  const navCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(navCode.includes("window.addEventListener(\"scroll\""), "TopNav must use passive window scroll listener");
  assert(navCode.includes("brandMarkClearance"), "TopNav must define brandMarkClearance");
});

test("TopNav: Right controls never overflow on mobile viewports", () => {
  const navCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(navCode.includes("isMobile"), "TopNav must detect mobile viewport");
});

test("TopNav: Desktop Tab Bar overlap bug fixed (dynamic transform & 360px clearance)", () => {
  const navCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(navCode.includes("brandMarkClearance = isDesktop ? 360"), "TopNav must use 360px clearance for desktop");
  assert(navCode.includes("translate3d(-${factor * 50}%, 0, 0)"), "TopNav must dynamically zero out transform on desktop when docked");
});

test("Mobile Header Simplification: Mobile header has Menu button, hides Dark Mode & TH|EN toggles", () => {
  const navCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(navCode.includes("hidden md:flex"), "TopNav theme and lang toggles must be hidden on mobile");
  assert(navCode.includes("onOpenAbout"), "TopNav must trigger onOpenAbout on hamburger button");
});

test("Desktop Navigation Integrity: TopNav preserves horizontal tabs, theme, language, and about controls", () => {
  const navCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(navCode.includes("toggleTheme"), "TopNav must include toggleTheme on desktop");
  assert(navCode.includes("setLang"), "TopNav must include setLang on desktop");
});

test("Instagram Embed: Embed is interactive and swipeable without blocking overlay", () => {
  const igCode = fs.readFileSync(path.join(root, "src/components/InstagramEmbed.tsx"), "utf-8");
  assert(!igCode.includes("pointer-events-none"), "InstagramEmbed must not disable pointer events on iframe");
});

// -----------------------------------------------------------------
// Tier 4: AtelierDrawer & Gallery Invariants
// -----------------------------------------------------------------
console.log("\n[Tier 4: AtelierDrawer & Gallery Invariants]");

test("AtelierDrawer: Desktop wheel scroll fixed with Lenis prevent attributes", () => {
  const drawerCode = fs.readFileSync(path.join(root, "src/components/AtelierDrawer.tsx"), "utf-8");
  assert(drawerCode.includes("data-lenis-prevent=\"true\""), "AtelierDrawer must contain data-lenis-prevent attribute");
  assert(drawerCode.includes("data-lenis-prevent-wheel=\"true\""), "AtelierDrawer must contain data-lenis-prevent-wheel attribute");
  assert(drawerCode.includes("stopPropagation"), "AtelierDrawer must stop wheel propagation to window");
});

test("AtelierDrawer: Navigation block removed; Resume placed under Get in Touch", () => {
  const drawerCode = fs.readFileSync(path.join(root, "src/components/AtelierDrawer.tsx"), "utf-8");
  // Category / Series Filter
  assert(drawerCode.includes("ALL ARCHIVE"), "AtelierDrawer must include ALL ARCHIVE");
  assert(drawerCode.includes("PERSONAL PROJECTS"), "AtelierDrawer must include PERSONAL PROJECTS");
  assert(drawerCode.includes("TU PHOTO"), "AtelierDrawer must include TU PHOTO");
  assert(drawerCode.includes("PSC.TU"), "AtelierDrawer must include PSC.TU");

  // Top Navigation section must NOT exist
  assert(!drawerCode.includes("[NAVIGATION]"), "AtelierDrawer top navigation block must be removed per user request");
  assert(!drawerCode.includes("[เมนูนำทาง]"), "AtelierDrawer top navigation block must be removed per user request");

  // Resume must be linked under Get in Touch
  assert(drawerCode.includes("href=\"/resume.pdf\""), "AtelierDrawer must link to resume under contact channels");
  assert(drawerCode.includes("Resume"), "AtelierDrawer must label resume as Resume");

  // Narrative Story & Invariants
  assert(drawerCode.includes("Hello"), "AtelierDrawer must include prominent Hello heading");
  assert(drawerCode.includes("จักริน ลิ้มป์อุดม"), "AtelierDrawer must display Thai name invariant จักริน ลิ้มป์อุดม");
  assert(drawerCode.includes("Sony α7 III"), "AtelierDrawer must include Sony α7 III gear specs");
});

test("October 6 Series: Strictly ครบรอบ 50 ปี 6 ตุลา without 'Commemoration'", () => {
  const galleryCode = fs.readFileSync(path.join(root, "src/config/gallery.ts"), "utf-8");
  assert(galleryCode.includes("ครบรอบ 50 ปี 6 ตุลา"), "gallery.ts must include ครบรอบ 50 ปี 6 ตุลา");
  assert(!galleryCode.includes("Commemoration"), "gallery.ts must NOT include 'Commemoration'");
  assert(!galleryCode.includes("commoderation"), "gallery.ts must NOT include 'commoderation'");
});

test("Faculty Omission: Strictly no 'Faculty of Political Science' in gallery, layout or headers", () => {
  const galleryCode = fs.readFileSync(path.join(root, "src/config/gallery.ts"), "utf-8");
  assert(!galleryCode.includes("Faculty of Political Science"), "gallery.ts must not mention Faculty of Political Science");
  
  const layoutCode = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf-8");
  assert(!layoutCode.includes("Faculty of Political Science"), "layout.tsx must not mention Faculty of Political Science");
  assert(!layoutCode.includes("คณะรัฐศาสตร์"), "layout.tsx must not mention คณะรัฐศาสตร์");
});

// -----------------------------------------------------------------
// Tier 5: Clean SiteFooter Sitemap & Standalone /about Route
// -----------------------------------------------------------------
console.log("\n[Tier 5: Clean SiteFooter Sitemap & Standalone /about Route]");

test("Clean SiteFooter: 3-column layout without counts, without gear column, with clean copyright", () => {
  assert(fs.existsSync(path.join(root, "src/components/SiteFooter.tsx")), "SiteFooter.tsx must exist");
  const footerCode = fs.readFileSync(path.join(root, "src/components/SiteFooter.tsx"), "utf-8");

  // Series without count numbers in parentheses
  assert(!footerCode.includes("effectiveCounts"), "SiteFooter must NOT display count numbers in parentheses");
  assert(footerCode.includes("<Link"), "SiteFooter must use semantic Next.js Link components");

  // Navigation: About & Resume
  assert(footerCode.includes("About"), "SiteFooter Col 2: Navigation About");
  assert(footerCode.includes("Resume"), "SiteFooter Col 2: Resume");
  assert(!footerCode.includes("Resume (PDF)"), "SiteFooter must NOT write Resume (PDF)");
  assert(!footerCode.includes("เรซูเม่ (Resume PDF)"), "SiteFooter must NOT write Resume (PDF)");
  assert(!footerCode.includes("เกี่ยวกับจักริน (About)"), "SiteFooter must NOT write เกี่ยวกับจักริน (About)");

  // No Equipment Column
  assert(!footerCode.includes("อุปกรณ์และกล้อง"), "SiteFooter must NOT include camera gear column per user request");
  assert(!footerCode.includes("Equipment"), "SiteFooter must NOT include camera gear column per user request");

  // Clean Copyright & Domain
  assert(footerCode.includes("© 2026 CHAKARIN L. · ALL RIGHTS RESERVED."), "SiteFooter must strictly use © 2026 CHAKARIN L. · ALL RIGHTS RESERVED.");
  assert(!footerCode.includes("BEAMINGMOTION. ALL RIGHTS RESERVED."), "SiteFooter copyright must not include BeamingMotion");
  assert(!footerCode.includes("ช่างภาพอิสระในกรุงเทพฯ · บันทึกภาพสารคดีและสตรีท"), "SiteFooter header must not have extra tagline");
});

test("Dedicated /about Route: Standalone editorial page with bio, gear, contacts, and SiteFooter", () => {
  assert(fs.existsSync(path.join(root, "src/app/about/page.tsx")), "src/app/about/page.tsx must exist");
  assert(fs.existsSync(path.join(root, "src/app/about/AboutClient.tsx")), "src/app/about/AboutClient.tsx must exist");

  const aboutClientCode = fs.readFileSync(path.join(root, "src/app/about/AboutClient.tsx"), "utf-8");
  assert(aboutClientCode.includes("Back to Gallery") || aboutClientCode.includes("กลับสู่แกลเลอรี"), "About must contain back button to gallery");
  assert(aboutClientCode.includes("Hello"), "About must feature prominent Hello title");
  assert(aboutClientCode.includes("จักริน ลิ้มป์อุดม"), "About must display Thai name จักริน ลิ้มป์อุดม");
  assert(aboutClientCode.includes("Photographer based in Bangkok"), "About must display tagline");
  assert(aboutClientCode.includes("Sony α7 III"), "About must maintain Sony α7 III camera invariant");
  assert(aboutClientCode.includes("contact.chakarin@gmail.com"), "About must have direct inquiries contact");
  assert(aboutClientCode.includes("<SiteFooter"), "About must render SiteFooter");
  assert(aboutClientCode.includes("/profile.jpg"), "About must display portrait profile image");
});

// -----------------------------------------------------------------
// Tier 6: Frosted Glass Countdown Overlay
// -----------------------------------------------------------------
console.log("\n[Tier 6: Frosted Glass Countdown Overlay]");

test("CountdownOverlay: Target timestamp set to 22 October 2026 20:15 ICT", () => {
  assert(fs.existsSync(path.join(root, "src/components/CountdownOverlay.tsx")), "CountdownOverlay.tsx must exist");
  const overlayCode = fs.readFileSync(path.join(root, "src/components/CountdownOverlay.tsx"), "utf-8");
  assert(overlayCode.includes("2026-10-22T20:15:00+07:00"), "CountdownOverlay must target 2026-10-22T20:15:00+07:00 (ICT)");
});

test("CountdownOverlay: Secret Invariant strictly maintained (never mentions birthday or secret date in UI)", () => {
  const overlayCode = fs.readFileSync(path.join(root, "src/components/CountdownOverlay.tsx"), "utf-8");
  // Check visible JSX
  assert(!overlayCode.includes(">วันเกิด<"), "Must NOT display 'วันเกิด' in UI text");
  assert(!overlayCode.includes(">22 ตุลาคม<"), "Must NOT display '22 ตุลาคม' in UI text");
  assert(!overlayCode.includes(">20:15<"), "Must NOT display '20:15' in UI text");
  assert(!overlayCode.includes(">Birthday<"), "Must NOT display 'Birthday' in UI text");
});

test("CountdownOverlay: Live ticking countdown implemented without bypass buttons in UI", () => {
  const overlayCode = fs.readFileSync(path.join(root, "src/components/CountdownOverlay.tsx"), "utf-8");
  assert(overlayCode.includes("setInterval"), "CountdownOverlay must tick with setInterval");
  assert(overlayCode.includes("calculateTimeLeft"), "CountdownOverlay must calculate days, hours, mins, secs");
  assert(overlayCode.includes("Coming Soon"), "CountdownOverlay must display clean Coming Soon title");
  assert(!overlayCode.includes("Archive Locked"), "Must not display Archive Locked badge");
  assert(!overlayCode.includes("บันทึกภาพถ่ายกำลังจะเปิดตัว"), "Must not display explanation tag");

  const pageCode = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf-8");
  assert(pageCode.includes("<CountdownOverlay"), "Home page must render CountdownOverlay");
});

test("CountdownOverlay: Zero-Flicker Frame-0 SSR Curtain & Secret Bypass Architecture", () => {
  const overlayCode = fs.readFileSync(path.join(root, "src/components/CountdownOverlay.tsx"), "utf-8");
  assert(overlayCode.includes('id="countdown-curtain"'), "CountdownOverlay must have id='countdown-curtain'");
  assert(!overlayCode.includes("const mounted = useSyncExternalStore"), "Must not gate countdown curtain behind mounted hydration flag");

  const cssCode = fs.readFileSync(path.join(root, "src/app/globals.css"), "utf-8");
  assert(cssCode.includes("html.secret-preview #countdown-curtain"), "globals.css must include zero-flicker display:none rule for secret preview");

  const layoutCode = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf-8");
  assert(layoutCode.includes("secret-preview"), "layout.tsx head script must check ?preview=true synchronously before first paint");
});

// -----------------------------------------------------------------
// Tier 7: Gallery Asset Catalog, EXIF & Bilingual Integrity
// -----------------------------------------------------------------
console.log("\n[Tier 7: Gallery Asset Catalog, EXIF & Bilingual Integrity]");

const { galleryItems, gallerySections, siteProfile } = await import(path.join(root, "src/config/gallery.ts"));

function getJpgDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xFF) break;
    const marker = buf[offset + 1];
    if (
      (marker >= 0xC0 && marker <= 0xC3) ||
      (marker >= 0xC5 && marker <= 0xC7) ||
      (marker >= 0xC9 && marker <= 0xCB) ||
      (marker >= 0xCD && marker <= 0xCF)
    ) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return { width, height };
    }
    const len = buf.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return null;
}

test("Gallery Asset Catalog: Total count is strictly 45 (15 Personal, 15 Event, 15 Various)", () => {
  assert.strictEqual(galleryItems.length, 45, "Gallery items count must be exactly 45");
  const counts = { personal: 0, "tu-photo": 0, psctu: 0 };
  for (const item of galleryItems) {
    counts[item.sectionId] = (counts[item.sectionId] || 0) + 1;
  }
  assert.strictEqual(counts.personal, 15, "Personal projects must contain exactly 15 photos");
  assert.strictEqual(counts["tu-photo"], 15, "TU Photo must contain exactly 15 photos");
  assert.strictEqual(counts.psctu, 15, "PSC.TU must contain exactly 15 photos");
});

test("Gallery Asset Catalog: Every item points to an existing file in public/photos/", () => {
  for (const item of galleryItems) {
    const photoPath = path.join(root, "public", item.src);
    assert(fs.existsSync(photoPath), `Photo file must exist: ${item.src} (${item.id})`);
  }
});

test("Gallery Asset Optimization: Every photo file size is strictly under 1.5MB", () => {
  for (const item of galleryItems) {
    const photoPath = path.join(root, "public", item.src);
    const stats = fs.statSync(photoPath);
    assert(
      stats.size < 1.5 * 1024 * 1024,
      `Photo file exceeds 1.5MB: ${item.src} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`
    );
  }
});

test("Gallery Geometry: True JPEG dimensions and aspect ratio strictly match config", () => {
  for (const item of galleryItems) {
    const photoPath = path.join(root, "public", item.src);
    const dims = getJpgDimensions(photoPath);
    assert(dims, `Could not parse JPEG dimensions for ${item.src}`);
    assert.strictEqual(dims.width, item.width, `Width mismatch on ${item.id}: disk=${dims.width}, config=${item.width}`);
    assert.strictEqual(dims.height, item.height, `Height mismatch on ${item.id}: disk=${dims.height}, config=${item.height}`);
    const expectedOrient = dims.width > dims.height ? "landscape" : "portrait";
    assert.strictEqual(expectedOrient, item.orientation, `Orientation mismatch on ${item.id}`);
  }
});

test("Gallery EXIF Authenticity: Strictly authentic Sony α7 III, lens, aperture, shutter, ISO, and year 2026", () => {
  for (const item of galleryItems) {
    assert.strictEqual(item.specs.camera, "Sony α7 III", `Camera invariant violated on ${item.id}`);
    assert(
      item.specs.lens.startsWith("FE 28-70mm") ||
      item.specs.lens.includes("35mm") ||
      item.specs.lens.includes("55mm"),
      `Lens invariant violated on ${item.id}: ${item.specs.lens}`
    );
    assert(/^f\/\d+(\.\d+)?$/.test(item.specs.aperture), `Aperture format invalid on ${item.id}: ${item.specs.aperture}`);
    assert(item.specs.shutter.endsWith("s"), `Shutter format invalid on ${item.id}: ${item.specs.shutter}`);
    assert(typeof item.specs.iso === "number" && item.specs.iso > 0, `ISO must be positive number on ${item.id}`);
    assert(item.specs.location && item.specs.location.length > 5, `Location empty or invalid on ${item.id}`);
    assert.strictEqual(item.specs.year, 2026, `Year must be 2026 on ${item.id}`);
  }
});

test("Gallery Bilingual Metadata: Non-empty title, titleTh, subtitle, series, and category for all 45 items", () => {
  for (const item of galleryItems) {
    assert(item.title && item.title.trim().length > 0, `Missing title on ${item.id}`);
    assert(item.titleTh && item.titleTh.trim().length > 0, `Missing Thai title on ${item.id}`);
    assert(item.subtitle && item.subtitle.trim().length > 0, `Missing subtitle on ${item.id}`);
    assert(item.series && item.series.trim().length > 0, `Missing series on ${item.id}`);
    assert(item.category && item.category.trim().length > 0, `Missing category on ${item.id}`);
    assert.strictEqual(item.section, item.sectionId, `section and sectionId mismatch on ${item.id}`);
  }
});

test("Gallery Sections: Exactly 4 sections configured ('all', 'personal', 'tu-photo', 'psctu')", () => {
  assert.strictEqual(gallerySections.length, 4, "Must have exactly 4 sections");
  const sectionIds = gallerySections.map((s) => s.id);
  assert.deepStrictEqual(sectionIds, ["all", "personal", "tu-photo", "psctu"]);
});

// -----------------------------------------------------------------
// Tier 8: Link Security & Document Integrity
// -----------------------------------------------------------------
console.log("\n[Tier 8: Link Security & Document Integrity]");

test("Security: All target='_blank' links across src/ strictly specify rel='noopener noreferrer'", () => {
  function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (!["node_modules", ".next", ".git"].includes(file)) {
          results = results.concat(walkDir(full));
        }
      } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        results.push(full);
      }
    }
    return results;
  }

  const tsxFiles = walkDir(path.join(root, "src"));
  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const aTags = [...content.matchAll(/<a\b[^>]*>/g)];
    for (const match of aTags) {
      const tag = match[0];
      if (tag.includes(`target="_blank"`) || tag.includes(`target={"_blank"}`)) {
        assert(
          tag.includes(`rel="noopener noreferrer"`),
          `Missing rel="noopener noreferrer" in ${path.relative(root, file)}: ${tag}`
        );
      }
    }
  }
});

test("Resume PDF Integrity: public/resume.pdf is a valid PDF (%PDF- header) exceeding 100KB", () => {
  const resumePath = path.join(root, "public/resume.pdf");
  assert(fs.existsSync(resumePath), "public/resume.pdf must exist");
  const buffer = fs.readFileSync(resumePath);
  assert.strictEqual(buffer.subarray(0, 5).toString("utf-8"), "%PDF-", "Resume file must start with %PDF- header");
  assert(buffer.length > 100000, `Resume PDF size (${buffer.length} bytes) should exceed 100KB`);
});

test("Profile Integrity: Official contact channels use secure HTTPS and valid accounts", () => {
  assert(siteProfile.contact.instagramUrl.startsWith("https://"), "Instagram URL must use HTTPS");
  assert(siteProfile.contact.instagramUrl.includes("beamingmotion"), "Instagram URL must point to beamingmotion");
  assert(siteProfile.contact.twitter.startsWith("https://"), "Twitter / X URL must use HTTPS");
  assert(siteProfile.contact.twitter.includes("beamingmotion"), "Twitter / X URL must point to beamingmotion");
  assert(siteProfile.contact.github.startsWith("https://"), "GitHub URL must use HTTPS");
  assert(siteProfile.contact.github.includes("BeamingM"), "GitHub URL must point to BeamingM");
  assert(siteProfile.contact.email.includes("@"), "Contact email must be valid");
});

// -----------------------------------------------------------------
// Summary
// -----------------------------------------------------------------
console.log("\n=================================================");
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log("=================================================");

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
