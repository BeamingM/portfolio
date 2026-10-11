export interface SectionInfo {
  id: string;
  title: string;
  folderName: string;
  description: string;
}

export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  series: string;
  sectionId: "personal" | "tu-photo" | "psctu";
  projectFolder: string;
  category?: string;
  width: number;
  height: number;
  orientation?: "landscape" | "portrait" | "square";
  specs: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
    location?: string;
    year?: string;
  };
}

export const gallerySections: SectionInfo[] = [
  {
    id: "all",
    title: "All Work",
    folderName: "ALL ARCHIVE",
    description: "Curated frames across all field projects",
  },
  {
    id: "personal",
    title: "Personal Projects",
    folderName: "Personal Projects 2026",
    description: "Hua Hin 2026 — Beam's Edited & Coastal Studies",
  },
  {
    id: "tu-photo",
    title: "TU Photo",
    folderName: "TU PHOTO 2026",
    description: "One Day Trip 2026 — บึม_beamingmotion",
  },
  {
    id: "psctu",
    title: "PSC.TU",
    folderName: "PSC.TU",
    description: "Faculty of Political Science · First Meet & Music",
  },
];

export const galleryItems: PhotoItem[] = [
  // SECTION: Personal Projects 2026
  {
    id: "personal-01",
    src: "/photos/personal-01.jpg",
    alt: "Hua Hin Coastal Light - Personal Projects 2026",
    title: "Hua Hin Coastline",
    subtitle: "Tide Line Geometry",
    series: "Hua Hin 2026",
    sectionId: "personal",
    projectFolder: "Personal Projects 2026",
    category: "Coastline",
    width: 2400,
    height: 1600,
    orientation: "landscape",
    specs: {
      camera: "SONY A7III",
      lens: "FE 35MM F1.8",
      aperture: "f/5.6",
      shutter: "1/800s",
      iso: "ISO 100",
      location: "HUA HIN",
      year: "2026",
    },
  },
  {
    id: "personal-02",
    src: "/photos/personal-02.jpg",
    alt: "Hua Hin Pier Structure - Personal Projects 2026",
    title: "Pier Shadows",
    subtitle: "Vertical Light Study",
    series: "Hua Hin 2026",
    sectionId: "personal",
    projectFolder: "Personal Projects 2026",
    category: "Architecture",
    width: 1600,
    height: 2400,
    orientation: "portrait",
    specs: {
      camera: "SONY A7III",
      lens: "FE 35MM F1.8",
      aperture: "f/2.8",
      shutter: "1/500s",
      iso: "ISO 100",
      location: "HUA HIN",
      year: "2026",
    },
  },
  {
    id: "personal-03",
    src: "/photos/personal-03.jpg",
    alt: "Old Town Solitude - Personal Projects 2026",
    title: "Old Town Solitude",
    subtitle: "Morning Shadows",
    series: "Bangkok Streets",
    sectionId: "personal",
    projectFolder: "Personal Projects 2026",
    category: "Street",
    width: 1600,
    height: 2400,
    orientation: "portrait",
    specs: {
      camera: "SONY A7III",
      lens: "FE 55MM F1.8 ZA",
      aperture: "f/2.8",
      shutter: "1/400s",
      iso: "ISO 200",
      location: "RATTANAKOSIN, BKK",
      year: "2026",
    },
  },
  {
    id: "personal-04",
    src: "/photos/personal-04.jpg",
    alt: "Hua Hin Evening Transit - Personal Projects 2026",
    title: "Evening Horizon",
    subtitle: "Quiet Sandbar",
    series: "Hua Hin 2026",
    sectionId: "personal",
    projectFolder: "Personal Projects 2026",
    category: "Landscape",
    width: 1600,
    height: 2400,
    orientation: "portrait",
    specs: {
      camera: "SONY A7III",
      lens: "FE 55MM F1.8 ZA",
      aperture: "f/4.0",
      shutter: "1/1000s",
      iso: "ISO 100",
      location: "HUA HIN",
      year: "2026",
    },
  },

  // SECTION: TU PHOTO 2026 (One Day Trip — บึม_beamingmotion)
  {
    id: "tu-01",
    src: "/photos/tu-01.jpg",
    alt: "คังด้ง - TU Photo One Day Trip 2026",
    title: "คังด้ง",
    subtitle: "Rooftop Perspective",
    series: "One Day Trip 2026",
    sectionId: "tu-photo",
    projectFolder: "TU PHOTO 2026",
    category: "Documentary",
    width: 2400,
    height: 1600,
    orientation: "landscape",
    specs: {
      camera: "SONY A7III",
      lens: "FE 35MM F1.8",
      aperture: "f/2.2",
      shutter: "1/320s",
      iso: "ISO 400",
      location: "BANGKOK",
      year: "2026",
    },
  },
  {
    id: "tu-02",
    src: "/photos/tu-02.jpg",
    alt: "ลึกลับ - TU Photo One Day Trip 2026",
    title: "ลึกลับ",
    subtitle: "Atmospheric Shadow",
    series: "One Day Trip 2026",
    sectionId: "tu-photo",
    projectFolder: "TU PHOTO 2026",
    category: "Mood",
    width: 2400,
    height: 1600,
    orientation: "landscape",
    specs: {
      camera: "SONY A7III",
      lens: "FE 35MM F1.8",
      aperture: "f/2.0",
      shutter: "1/200s",
      iso: "ISO 800",
      location: "BANGKOK",
      year: "2026",
    },
  },
  {
    id: "tu-03",
    src: "/photos/tu-03.jpg",
    alt: "รูปอันหย่ายย - TU Photo One Day Trip 2026",
    title: "รูปอันหย่ายย",
    subtitle: "Vertical Monument",
    series: "One Day Trip 2026",
    sectionId: "tu-photo",
    projectFolder: "TU PHOTO 2026",
    category: "Street Portrait",
    width: 1600,
    height: 2400,
    orientation: "portrait",
    specs: {
      camera: "SONY A7III",
      lens: "FE 55MM F1.8 ZA",
      aperture: "f/1.8",
      shutter: "1/500s",
      iso: "ISO 200",
      location: "BANGKOK",
      year: "2026",
    },
  },
  {
    id: "tu-04",
    src: "/photos/tu-04.jpg",
    alt: "Silhouette - TU Photo One Day Trip 2026",
    title: "Silhouette",
    subtitle: "High Contrast Contours",
    series: "One Day Trip 2026",
    sectionId: "tu-photo",
    projectFolder: "TU PHOTO 2026",
    category: "Contrast",
    width: 2400,
    height: 1600,
    orientation: "landscape",
    specs: {
      camera: "SONY A7III",
      lens: "FE 55MM F1.8 ZA",
      aperture: "f/2.8",
      shutter: "1/1000s",
      iso: "ISO 100",
      location: "BANGKOK",
      year: "2026",
    },
  },
  {
    id: "tu-05",
    src: "/photos/tu-05.jpg",
    alt: "ผ่านมุมมอง - TU Photo One Day Trip 2026",
    title: "ผ่านมุมมอง",
    subtitle: "Frames within Frames",
    series: "One Day Trip 2026",
    sectionId: "tu-photo",
    projectFolder: "TU PHOTO 2026",
    category: "Geometry",
    width: 2400,
    height: 1600,
    orientation: "landscape",
    specs: {
      camera: "SONY A7III",
      lens: "FE 35MM F1.8",
      aperture: "f/2.5",
      shutter: "1/400s",
      iso: "ISO 320",
      location: "BANGKOK",
      year: "2026",
    },
  },

  // SECTION: PSC.TU (First Meet ไหว้ครู & Polsci)
  {
    id: "psctu-01",
    src: "/photos/psctu-01.jpg",
    alt: "First Meet ไหว้ครู - PSC.TU",
    title: "First Meet ไหว้ครู I",
    subtitle: "Faculty Tradition",
    series: "First Meet ไหว้ครู",
    sectionId: "psctu",
    projectFolder: "PSC.TU",
    category: "Event Documentary",
    width: 2400,
    height: 1600,
    orientation: "landscape",
    specs: {
      camera: "SONY A7III",
      lens: "FE 35MM F1.8",
      aperture: "f/2.8",
      shutter: "1/250s",
      iso: "ISO 640",
      location: "THAMMASAT UNIVERSITY",
      year: "2026",
    },
  },
  {
    id: "psctu-02",
    src: "/photos/psctu-02.jpg",
    alt: "First Meet ไหว้ครู II - PSC.TU",
    title: "First Meet ไหว้ครู II",
    subtitle: "Faculty Community",
    series: "First Meet ไหว้ครู",
    sectionId: "psctu",
    projectFolder: "PSC.TU",
    category: "Event Documentary",
    width: 2400,
    height: 1600,
    orientation: "landscape",
    specs: {
      camera: "SONY A7III",
      lens: "FE 55MM F1.8 ZA",
      aperture: "f/2.0",
      shutter: "1/320s",
      iso: "ISO 800",
      location: "THAMMASAT UNIVERSITY",
      year: "2026",
    },
  },
];

export const siteProfile = {
  name: "Chakarin L.",
  alias: "BeamingMotion",
  role: "Photographer based in Bangkok",
  location: "Bangkok, Thailand",
  bio: {
    en: "Bangkok-based photographer capturing street scenes, candid moments, and everyday life around the city.",
    th: "ถ่ายภาพสตรีท งานกิจกรรม และโมเมนต์จริงในกรุงเทพฯ เน้นเก็บบรรยากาศที่เป็นธรรมชาติและเรื่องราวระหว่างทาง",
  },
  gear: {
    system: "Sony α7 III",
    lenses: ["FE 35mm F1.8", "Sonnar T* FE 55mm F1.8 ZA"],
    optics: ["FE 35mm F1.8", "Sonnar T* FE 55mm F1.8 ZA"],
  },
  contact: {
    email: "contact.chakarin@gmail.com",
    instagram: "beamingmotion",
    instagramUrl: "https://www.instagram.com/beamingmotion",
  },
};
