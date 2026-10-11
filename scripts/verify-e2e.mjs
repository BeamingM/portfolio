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
});

test("Tagline invariant: 'Photographer based in Bangkok' strictly maintained", () => {
  const langCode = fs.readFileSync(path.join(root, "src/context/LanguageContext.tsx"), "utf-8");
  assert(langCode.includes("Photographer based in Bangkok"), "Tagline invariant required");
  
  const layoutCode = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf-8");
  assert(layoutCode.includes("Photographer based in Bangkok"), "Metadata tagline invariant required");
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
// Tier 3: Mobile Responsiveness & Bug Fixes
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

test("Instagram Embed: Embed is interactive and swipeable without blocking overlay", () => {
  const igCode = fs.readFileSync(path.join(root, "src/components/InstagramEmbed.tsx"), "utf-8");
  assert(igCode.includes("data-figma-photo=\"true\""), "InstagramEmbed must provide data-figma-photo attribute");
  assert(!igCode.includes("absolute inset-0 z-20 cursor-pointer"), "InstagramEmbed must not have blocking overlay so carousel photos can be swiped");
});

// -----------------------------------------------------------------
// Tier 4: billguo.me Inspired Features
// -----------------------------------------------------------------
console.log("\n[Tier 4: billguo.me / craft Inspired Features]");

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
  
  // Clean greeting assertions
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

test("Social Channels: Twitter / X (@beamingmotion), Email, Instagram, and Resume linked in Drawer", () => {
  const drawerCode = fs.readFileSync(path.join(root, "src/components/AtelierDrawer.tsx"), "utf-8");
  assert(drawerCode.includes("https://x.com/beamingmotion"), "AtelierDrawer must link to Twitter / X");
  assert(drawerCode.includes("contact.chakarin@gmail.com"), "AtelierDrawer must display email");
  assert(drawerCode.includes("/resume.pdf"), "AtelierDrawer must offer download resume PDF");
  assert(drawerCode.includes("beamingmotion"), "AtelierDrawer must link to Instagram");
  assert(drawerCode.includes("Hello"), "AtelierDrawer must include prominent Hello heading");
  assert(drawerCode.includes("backdrop-blur-2xl"), "AtelierDrawer must use frosted glass backdrop blur");
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
// Tier 5: Lightbox Fix, Natural Stack Physics & Morphing Filter Bar
// -----------------------------------------------------------------
console.log("\n[Tier 5: Lightbox Fix, Natural Stack Physics & Morphing Filter Bar]");

test("PhotoModal: Direct responsive sizing prevents 0x0 container collapse", () => {
  const modalCode = fs.readFileSync(path.join(root, "src/components/PhotoModal.tsx"), "utf-8");
  assert(modalCode.includes("max-h-[72vh] sm:max-h-[74vh]"), "PhotoModal must provide responsive max-height");
  assert(modalCode.includes("max-w-[92vw] sm:max-w-[88vw]"), "PhotoModal must provide responsive max-width");
  assert(modalCode.includes("w-auto h-auto object-contain"), "PhotoModal must size image with w-auto h-auto object-contain");
  assert(!modalCode.includes("aspectRatio: photo.width / photo.height"), "PhotoModal must not rely on collapsing aspectRatio flex child");
  assert(modalCode.includes("isZoomed"), "PhotoModal must support 1:1 zoom inspection");
  assert(modalCode.includes("Sony α7 III"), "PhotoModal EXIF HUD must maintain Sony α7 III invariant");
});

test("PhotoDeckStack: Natural fling swipe physics, consistent keying & tap inspection threshold", () => {
  const stackCode = fs.readFileSync(path.join(root, "src/components/PhotoDeckStack.tsx"), "utf-8");
  assert(stackCode.includes("key={photo.id}"), "StackCard must use stable photo.id keys to prevent unmounting flashes");
  assert(!stackCode.includes("key={`bg-${offset}"), "Background cards must not change keys on each advance");
  assert(stackCode.includes("dragDistanceRef"), "StackCard must track pointer drag displacement");
  assert(stackCode.includes("animate(dragX, -700") || stackCode.includes("animate(dragX, -750"), "Must fling card smoothly offscreen left on swipe left");
  assert(stackCode.includes("animate(dragX, 700") || stackCode.includes("animate(dragX, 750"), "Must fling card smoothly offscreen right on swipe right");
  assert(stackCode.includes("Sony α7 III"), "PhotoDeckStack must strictly display Sony α7 III invariant");
});

test("TopNav: Unified Morphing Filter Bar dynamically measures hero-filter-anchor to prevent text collision", () => {
  const topNavCode = fs.readFileSync(path.join(root, "src/components/TopNav.tsx"), "utf-8");
  const pageCode = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf-8");
  assert(pageCode.includes('id="hero-filter-anchor"'), "page.tsx must provide hero-filter-anchor slot below greeting");
  assert(topNavCode.includes("heroFilterTop"), "TopNav must dynamically measure and interpolate heroFilterTop");
  assert(topNavCode.includes("hero-filter-anchor"), "TopNav must measure hero-filter-anchor DOM element");
  assert(topNavCode.includes("brandMarkClearance"), "TopNav must maintain exact clearance from BrandMark");
});

test("InteractivePrintCard: Documentary metadata bar preserves Sony α7 III invariant without SONY ... truncation", () => {
  const cardCode = fs.readFileSync(path.join(root, "src/components/InteractivePrintCard.tsx"), "utf-8");
  assert(cardCode.includes("Sony α7 III"), "PrintCard must maintain Sony α7 III invariant");
  assert(cardCode.includes("photo.series"), "PrintCard must display project series name");
  assert(cardCode.includes("photo.specs.location"), "PrintCard must display location");
  assert(!cardCode.includes("max-w-[200px]"), "PrintCard must not constrain camera container with cramped max-width");
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
