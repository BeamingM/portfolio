# CHAKARIN L. — Portfolio Blueprint & Specification
**Aesthetic DNA:** Teenage Engineering × Apple × OpenAI Astra (Utilitarian Tech-Chic & Cinematic Scrollytelling)

---

## 1. Executive Summary & Brand Foundation

| มิติ | ข้อสรุปจากการ Grill |
|---|---|
| **Identity / Brand Name** | `CHAKARIN L.` |
| **Discipline & Role** | Visual Media / Photographer (Bangkok, TH) |
| **Core Intent** | Personal Brand & Curated Exhibition (Picture-based, High-End Craft) |
| **Project Nomenclature** | **Pure Picture-Based** (ไม่มีชื่อโปรเจกต์ เน้นภาพเพียวๆ ไม่ยัดเยียดการตั้งชื่อ) |
| **Language** | สองภาษา (EN / TH) ผ่านการตรวจจับเครื่องอัตโนมัติ (Device Auto-detect) + ตัวเลือกสลับภาษาแบบ Apple ที่ Footer ล่างสุด |
| **Tech Stack** | **Next.js 14+ (App Router)** + **Tailwind CSS** + **Framer Motion** + **Lenis Smooth Scroll** |
| **Deployment Target** | Vercel (Edge CDN, โหลดภาพไวระดับสากล, ฟรี) |

---

## 2. Design System: The Aesthetic Matrix

ความลงตัวระหว่าง **ความดิบแบบฮาร์ดแวร์ของ Teenage Engineering** + **ความเนี้ยบไร้รอยต่อของ Apple** + **ความเฉียบคมล้ำยุคของ OpenAI Merch**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [CHAKARIN L.]                    BKK 02:45 AM              [INFO/ABOUT]│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                                                                        │
│                      [ FULL-BLEED STICKY IMAGE ]                       │
│                                                                        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [FRAME 01/08]               35MM · F/2.8 · 1/500S · ISO 100            │
└────────────────────────────────────────────────────────────────────────┘
```

### Color Palette (Minimal Bone / Warm Off-White)
* **Canvas Background:** `#FBFBF9` (Warm Paper White / TE Hardware Casing)
* **Surface / Drawer:** `#F4F4F0` (Bone Matte Ceramic)
* **Hairline Borders:** `#E5E5DF` (1px Subtle Divider lines)
* **Primary Text:** `#121212` (Deep Charcoal Black)
* **Secondary / Metadata:** `#737373` (Muted Graphite Monospace)
* **Subtle Accent:** `#FF3E00` (Safety Orange เล็กๆ สไตล์ TE ใช้เฉพาะจุด Active / Indicator เล็กจิ๋ว)

### Typography Pairing
* **Display / Body:** `Inter` หรือ `Geist Sans` (คม ชัด มินิมอลแบบ Apple/OpenAI)
* **Metadata & Technical Badges:** `Geist Mono` หรือ `Space Mono` (ตัวเลขสเปกกล้อง, พิกัด, ลำดับภาพ)

---

## 3. Experience Architecture: Sticky Cinematic Scrollytelling

ไม่ใช้แกลเลอรีแบบเดิมๆ ที่ต้องคลิกดูรูป แต่ใช้ **Scroll-Driven Narrative** เหมือนหน้าเปิดตัวฮาร์ดแวร์ของ Apple / OpenAI:

1. **Sticky Viewport Stage:**
   * ตัวเฟรมภาพจะถูก Pin ตรึงนิ่งตรงกลางจอ
   * เมื่อผู้ใช้ไถ Scroll (Scroll-down) ภาพจะค่อยๆ ซูมออกหรือเปลี่ยนมิติอย่างนุ่มนวล (60fps ผ่าน Lenis)
2. **Dynamic HUD Overlay (Heads-Up Display):**
   * **Top-Left:** `CHAKARIN L.`
   * **Top-Center:** นาฬิกาเวลาจริงในกรุงเทพฯ `BKK 02:45:12` (ได้ฟีลฮาร์ดแวร์/สถานีสำรวจ)
   * **Top-Right:** ปุ่ม `[ABOUT]` ที่เปิด Drawer ออกมาจากด้านข้าง
   * **Bottom-Left:** ตัวเลขนับภาพแบบฮาร์ดแวร์ `[01 / 08]`
   * **Bottom-Right:** Technical Spec Badge เช่น `LEICA M11 · 35MM SUMMICRON · F/2.0 · 1/1000s · ISO 64`
3. **Smooth Image Crossfade / Scrubbing:**
   * สลับจากภาพที่ 1 สู่ภาพถัดไปด้วยการ Scrub ของ Scrollbar
   * เน้นภาพเพียวๆ ให้ผลงานเป็นตัวเอก ไม่ถูกขัดจังหวะด้วยข้อความรกๆ

---

## 4. About & Colophon Drawer (`[ABOUT]`)

เมื่อกดปุ่ม `[ABOUT]` ที่มุมบนขวา จะมี Slide-over Panel ค่อยๆ สไลด์ออกมาอย่างนุ่มนวล:

* **Short Statement:** คำนิยามมุมมองด้านภาพและศิลปะ 2 บรรทัด (ภาษาอังกฤษ & ไทย)
* **Location:** `Bangkok, Thailand (13.7563° N, 100.5018° E)`
* **Equipment & Tech Specs (TE Hardware Style):**
  * `BODY:` Sony / Leica / Film SLR
  * `OPTICS:` Prime lenses (35mm / 50mm)
  * `MEDIUM:` Digital Raw & 35mm Film
* **Direct Channels:**
  * **Email:** `hello@chakarin.com` (พร้อมปุ่ม Click-to-copy ที่ขึ้น Feedback ว่า `[COPIED]`)
  * **Instagram:** `@chakarin.l` (เปิดแท็บใหม่)
* **Colophon / Apple-Style Footer:**
  * © 2026 CHAKARIN L. All rights reserved.
  * แถบเลือกภาษาเล็กๆ สไตล์ Apple: `Language: [EN / TH]`

---

## 5. Directory Structure & Photo Configuration

ออกแบบโครงสร้างให้อัปเดตรูปจาก SSD ได้ง่ายที่สุดในอนาคต เพียงแค่โยนไฟล์รูปเข้าโฟลเดอร์แล้วแก้ไข config เดียว:

```
portfolio/
├── public/
│   └── photos/              <-- โยนรูปภาพความละเอียดสูงจาก SSD มาไว้ที่นี่
│       ├── 01.jpg
│       ├── 02.jpg
│       └── ...
├── src/
│   ├── config/
│   │   └── gallery.ts       <-- ไฟล์เดียวที่ระบุรูปและสเปกกล้อง (Metadata)
│   ├── components/
│   │   ├── ScrollytellingStage.tsx
│   │   ├── HudHeader.tsx
│   │   ├── HudFooter.tsx
│   │   └── AboutDrawer.tsx
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
```

### ตัวอย่าง `gallery.ts` Config:
```typescript
export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  specs: {
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
    location?: string;
  };
}

export const galleryItems: PhotoItem[] = [
  {
    id: "frame-01",
    src: "/photos/01.jpg",
    alt: "Visual Study 01",
    specs: {
      camera: "SONY A7IV",
      lens: "FE 35MM F1.4 GM",
      aperture: "f/2.0",
      shutter: "1/500s",
      iso: "ISO 100",
      location: "BANGKOK"
    }
  }
];
```

---

## 6. Readiness Checklist (เมื่อพร้อมเริ่มทำจริง)

- [ ] เสียบ SSD และคัดเลือกภาพจำนวน 4-8 ภาพที่เป็น Masterpiece จริงๆ
- [ ] Export ภาพเป็นไฟล์ WebP หรือ High-Quality JPEG (แนะนำความกว้าง 2400px - 3200px)
- [ ] นำไฟล์มาวางในโฟลเดอร์โปรเจกต์
- [ ] แจ้ง Antigravity เพื่อเริ่มเขียนโค้ดและรันโปรเจกต์ให้ทันที!
