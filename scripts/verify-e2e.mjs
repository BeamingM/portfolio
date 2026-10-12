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

  const footerCode = fs.readFileSync(path.join(root, "src/components/SiteFooter.tsx"), "utf-8");
  assert(footerCode.includes("Sony α7 III"), "SiteFooter must display camera invariant Sony α7 III");

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

// -----------------------------------------------------------------
// Tier 2: Sound Removal & Single Toolbar
// -----------------------------------------------------------------
console.log("\n[Tier 2: Feature Deletion Verification (Sound Gimmick & 2nd Toolbar)]");

test("Sound gimmick completely removed: No speaker mute toggle in TopNav", () => {
  const topNavCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(!topNavCode.includes("Volume2"), "TopNav must not import or render Volume2");
  assert(!topNavCode.includes("VolumeX"), "TopNav must not import or render VolumeX");
  assert(!topNavCode.includes("toggleSound"), "TopNav must not invoke toggleSound");
});

test("SoundProvider completely removed from root layout", () => {
  const layoutCode = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf-8");
  assert(!layoutCode.includes("<SoundProvider>"), "RootLayout must not wrap with SoundProvider");
  assert(!layoutCode.includes("from \"@/context/SoundContext\""), "layout.tsx must not import SoundContext");
});

test("2nd Toolbar (Lens selector) completely removed: Only ONE toolbar exists", () => {
  const filterBarCode = fs.readFileSync(path.join(root, "src/components/SectionFilterBar.tsx"), "utf-8");
  assert(!filterBarCode.includes("activeLens"), "SectionFilterBar must not contain activeLens state");
  assert(!filterBarCode.includes("lensOptions"), "SectionFilterBar must not render lensOptions toolbar");
  assert(!filterBarCode.includes("Optics:"), "SectionFilterBar must not render Optics second toolbar");
  
  const pageCode = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf-8");
  assert(!pageCode.includes("LENS_DEFINITIONS"), "page.tsx must not declare LENS_DEFINITIONS");
});

// -----------------------------------------------------------------
// Tier 3: Mobile Responsiveness & Header Simplification
// -----------------------------------------------------------------
console.log("\n[Tier 3: Mobile Responsiveness, Scroll Morph & IG Mouse Capture]");

test("SmoothScroll: Lenis touch interception disabled on mobile to prevent freezing", () => {
  const smoothScrollCode = fs.readFileSync(path.join(root, "src/components/SmoothScroll.tsx"), "utf-8");
  assert(smoothScrollCode.includes("pointer: coarse"), "SmoothScroll must detect coarse/touch pointers");
  assert(smoothScrollCode.includes("isTouch"), "SmoothScroll must conditionally disable Lenis on touch devices");
});

test("TopNav: BrandMark morph uses native scroll listener with zero-calc formula", () => {
  const topNavCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(topNavCode.includes("window.addEventListener(\"scroll\""), "TopNav must listen to native scroll events");
  assert(topNavCode.includes("translate3d"), "TopNav must use hardware-accelerated translate3d");
  assert(!topNavCode.includes("50vw - var(--nav-pad"), "TopNav must not use buggy CSS calc with mixed vw and %");
});

test("TopNav: Right controls never overflow on mobile viewports", () => {
  const topNavCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(topNavCode.includes("overflow-x-hidden"), "TopNav header must have overflow-x-hidden");
  assert(topNavCode.includes("shrink-0 ml-auto"), "Right controls must have shrink-0 ml-auto");
  assert(topNavCode.includes("max-w-[calc(100vw-180px)]"), "BrandMark must reserve room for right controls on mobile");
});

test("Mobile Header Simplification: Mobile header has Menu button, hides Dark Mode & TH|EN toggles", () => {
  const topNavCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  assert(topNavCode.includes("Menu"), "TopNav must import Menu icon");
  assert(topNavCode.includes("md:hidden"), "Mobile menu button must be rendered on mobile (md:hidden)");
  assert(topNavCode.includes("hidden md:flex"), "Desktop controls must be hidden on mobile (hidden md:flex)");
  assert(!topNavCode.includes("isDropdownOpen"), "TopNav must not render cluttered dropdown pill state");
});

test("Instagram Embed: Embed is interactive and swipeable without blocking overlay", () => {
  const igCode = fs.readFileSync(path.join(root, "src/components/InstagramEmbed.tsx"), "utf-8");
  assert(igCode.includes("data-figma-photo=\"true\""), "InstagramEmbed must provide data-figma-photo attribute");
  assert(!igCode.includes("absolute inset-0 z-20 cursor-pointer"), "InstagramEmbed must not have blocking overlay so carousel photos can be swiped");
});

// -----------------------------------------------------------------
// Tier 4: Editorial Photobook & AtelierDrawer Features
// -----------------------------------------------------------------
console.log("\n[Tier 4: billguo.me / craft Inspired Features & Drawer Integration]");

test("InteractivePrintCard: 3D perspective tilt & glossy holographic sheen implemented", () => {
  const cardCode = fs.readFileSync(path.join(root, "src/components/InteractivePrintCard.tsx"), "utf-8");
  assert(cardCode.includes("perspective: 1200"), "InteractivePrintCard must set 3D perspective");
  assert(cardCode.includes("rotateX"), "InteractivePrintCard must compute rotateX tilt");
  assert(cardCode.includes("rotateY"), "InteractivePrintCard must compute rotateY tilt");
  assert(cardCode.includes("radial-gradient"), "InteractivePrintCard must render dynamic glossy sheen hotspot");
  assert(cardCode.includes("mixBlendMode: \"overlay\""), "InteractivePrintCard must use overlay blend mode for print sheen");
});

test("InteractivePrintCard: Deep diffused floating museum shadow on hover implemented", () => {
  const cardCode = fs.readFileSync(path.join(root, "src/components/InteractivePrintCard.tsx"), "utf-8");
  assert(cardCode.includes("boxShadow: isHovered"), "InteractivePrintCard must dynamically compute floating shadow");
  assert(cardCode.includes("shadowX") && cardCode.includes("shadowY"), "Shadow coordinates must dynamically shift with tilt");
});

test("Streamlined Exhibition: Dedicated Editorial Photobook Showcase", () => {
  const pageCode = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf-8");
  assert(pageCode.includes("EditorialPhotobook"), "page.tsx must render EditorialPhotobook showcase");
  assert(!pageCode.includes("PhotoDeckStack"), "page.tsx must not render unneeded PhotoDeckStack");
  
  const filterCode = fs.readFileSync(path.join(root, "src/components/SectionFilterBar.tsx"), "utf-8");
  assert(!filterCode.includes("STACK"), "SectionFilterBar must be streamlined without redundant mode toggles");
});

test("Focused Navigation: Command Palette search paused to eliminate unnecessary complexity", () => {
  const pageCode = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf-8");
  assert(!pageCode.includes("CommandPalette"), "page.tsx must omit CommandPalette when paused");
  assert(!pageCode.includes("Press ⌘K to search"), "Hero must not prompt ⌘K search");
});

test("Authentic Apple-Style Floating Narrative Greeting (No boxes, no badges, pure typography)", () => {
  assert(fs.existsSync(path.join(root, "src/components/ProjectDescriptionHeader.tsx")), "ProjectDescriptionHeader must exist");
  const headerCode = fs.readFileSync(path.join(root, "src/components/ProjectDescriptionHeader.tsx"), "utf-8");
  
  assert(headerCode.includes("จังหวะชีวิตประจำวัน แสงเงา"), "Must include updated poetic Thai greeting");
  assert(headerCode.includes("Documenting the rhythm of everyday life"), "Must include updated English greeting");
  assert(!headerCode.includes("CURATED ARCHIVE"), "Must not contain rigid CURATED ARCHIVE orange badge");
  assert(!headerCode.includes("Singhdang #77"), "Must not contain hashtag tag soup");
  assert(!headerCode.includes("rounded-xl border"), "Must be borderless floating typography without box cards");
});

test("Vercel Analytics: @vercel/analytics integrated into RootLayout", () => {
  const layoutCode = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf-8");
  assert(layoutCode.includes("@vercel/analytics/react"), "RootLayout must import Analytics from @vercel/analytics/react");
  assert(layoutCode.includes("<Analytics />"), "RootLayout must render <Analytics />");
});

test("Mobile Drawer (AtelierDrawer): Combines category filters, bio, links, gear, and bottom utilities", () => {
  const drawerCode = fs.readFileSync(path.join(root, "src/components/AtelierDrawer.tsx"), "utf-8");
  // Category / Series Filter
  assert(drawerCode.includes("ALL ARCHIVE"), "AtelierDrawer must include ALL ARCHIVE");
  assert(drawerCode.includes("PERSONAL PROJECTS"), "AtelierDrawer must include PERSONAL PROJECTS");
  assert(drawerCode.includes("TU PHOTO"), "AtelierDrawer must include TU PHOTO");
  assert(drawerCode.includes("PSC.TU"), "AtelierDrawer must include PSC.TU");
  assert(drawerCode.includes("onSelectSection"), "AtelierDrawer must accept onSelectSection callback");
  assert(drawerCode.includes("useRouter"), "AtelierDrawer must use Next.js useRouter for soft client navigation");
  assert(!drawerCode.includes("window.location.href"), "AtelierDrawer must not use full page reload window.location.href");

  // Navigation Links
  assert(drawerCode.includes("href=\"/about\""), "AtelierDrawer must link to /about");
  assert(drawerCode.includes("href=\"/\""), "AtelierDrawer must link to /");
  assert(drawerCode.includes("href=\"/resume.pdf\""), "AtelierDrawer must link to resume");

  // Narrative Story & Invariants
  assert(drawerCode.includes("Hello"), "AtelierDrawer must include prominent Hello heading");
  assert(drawerCode.includes("จักริน ลิ้มป์อุดม"), "AtelierDrawer must display Thai name invariant จักริน ลิ้มป์อุดม");
  assert(drawerCode.includes("เริ่มถ่ายรูปเพราะ"), "AtelierDrawer must include Thai narrative story");

  // Equipment & Contacts
  assert(drawerCode.includes("Sony α7 III"), "AtelierDrawer must include Sony α7 III gear specs");
  assert(drawerCode.includes("contact.chakarin@gmail.com"), "AtelierDrawer must display email");
  assert(drawerCode.includes("https://x.com/beamingmotion"), "AtelierDrawer must link to Twitter / X");
  assert(drawerCode.includes("beamingmotion"), "AtelierDrawer must link to Instagram");

  // Bottom Theme & Language
  assert(drawerCode.includes("toggleTheme"), "AtelierDrawer must include theme toggle");
  assert(drawerCode.includes("setLang"), "AtelierDrawer must include language switch");
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
// Tier 5: Footer Sitemap & Standalone /about Route
// -----------------------------------------------------------------
console.log("\n[Tier 5: Comprehensive Footer Sitemap & Dedicated /about Route]");

test("Comprehensive Footer Sitemap (SiteFooter): 4-column rich editorial sitemap with bottom utilities", () => {
  assert(fs.existsSync(path.join(root, "src/components/SiteFooter.tsx")), "SiteFooter.tsx must exist");
  const footerCode = fs.readFileSync(path.join(root, "src/components/SiteFooter.tsx"), "utf-8");

  // 4 Columns
  assert(footerCode.includes("Archive Series") || footerCode.includes("หมวดภาพถ่าย"), "SiteFooter Col 1: Archive Series");
  assert(footerCode.includes("<Link"), "SiteFooter Col 1 must use semantic Next.js Link components");
  assert(!footerCode.includes("window.location.href"), "SiteFooter must not use window.location.href hard reloads");
  assert(footerCode.includes("/about"), "SiteFooter Col 2: Navigation to /about");
  assert(footerCode.includes("/resume.pdf"), "SiteFooter Col 2: Resume PDF");
  assert(footerCode.includes("contact.chakarin@gmail.com"), "SiteFooter Col 3: Email");
  assert(footerCode.includes("beamingmotion"), "SiteFooter Col 3: Social channels");
  assert(footerCode.includes("Sony α7 III"), "SiteFooter Col 4: Equipment Sony α7 III");
  assert(footerCode.includes("FE 28-70mm"), "SiteFooter Col 4: Optics");

  // Bottom Utility Row
  assert(footerCode.includes("toggleTheme"), "SiteFooter must have Theme toggle");
  assert(footerCode.includes("setLang"), "SiteFooter must have Language switcher");
  assert(footerCode.includes("chakarin.pics"), "SiteFooter must display chakarin.pics colophon");
  assert(footerCode.includes("© 2026 CHAKARIN L. · BEAMINGMOTION. ALL RIGHTS RESERVED."), "SiteFooter must display exact copyright");

  // Rendered on page.tsx
  const pageCode = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf-8");
  assert(pageCode.includes("<SiteFooter"), "page.tsx must render SiteFooter");
  assert(pageCode.includes("pushState"), "page.tsx must synchronize section to browser history pushState");
  assert(pageCode.includes("popstate"), "page.tsx must listen to popstate for back/forward navigation");
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
  assert(aboutClientCode.includes("<PhotoModal"), "About must support lightbox modal inspection for featured print");
});

test("PhotoModal: Direct responsive sizing prevents 0x0 container collapse", () => {
  const modalCode = fs.readFileSync(path.join(root, "src/components/PhotoModal.tsx"), "utf-8");
  assert(modalCode.includes("max-h-[72vh] sm:max-h-[74vh]"), "PhotoModal must provide responsive max-height");
  assert(modalCode.includes("max-w-[92vw] sm:max-w-[88vw]"), "PhotoModal must provide responsive max-width");
  assert(modalCode.includes("w-auto h-auto object-contain"), "PhotoModal must size image with w-auto h-auto object-contain");
  assert(!modalCode.includes("aspectRatio: photo.width / photo.height"), "PhotoModal must not rely on collapsing aspectRatio flex child");
  assert(modalCode.includes("isZoomed"), "PhotoModal must support 1:1 zoom inspection");
  assert(modalCode.includes("Sony α7 III"), "PhotoModal EXIF HUD must maintain Sony α7 III invariant");
});

test("Thai Typography: font-mono includes Anuphan fallback in globals.css", () => {
  const cssCode = fs.readFileSync(path.join(root, "src/app/globals.css"), "utf-8");
  assert(cssCode.includes("var(--font-anuphan)"), "globals.css must include var(--font-anuphan)");
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
