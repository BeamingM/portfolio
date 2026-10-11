export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  series: string;
  caption: string;
  category?: string;
  width: number;
  height: number;
  orientation?: "landscape" | "portrait" | "square";
  specs: {
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
    location?: string;
    year?: string;
  };
}

export const galleryItems: PhotoItem[] = [
  {
    id: "frame-01",
    src: "/photos/01.jpg",
    alt: "Yaowarat Monsoon Night - Bangkok Chinatown",
    title: "Yaowarat at 03:00",
    subtitle: "Monsoon Night",
    series: "Bangkok Streets",
    category: "Night Street",
    caption: "Rain on asphalt. Wet neon reflections cutting through humid night air.",
    width: 2400,
    height: 1600,
    orientation: "landscape",
    specs: {
      camera: "SONY A7III",
      lens: "FE 35MM F1.8",
      aperture: "f/2.0",
      shutter: "1/125s",
      iso: "ISO 800",
      location: "YAOWARAT, BKK",
      year: "2026"
    }
  },
  {
    id: "frame-02",
    src: "/photos/02.jpg",
    alt: "Old Town Morning Light",
    title: "Old Town Solitude",
    subtitle: "Morning Shadows",
    series: "Bangkok Streets",
    category: "Documentary",
    caption: "Morning shadows elongating across cracked lime plaster walls.",
    width: 1600,
    height: 2400,
    orientation: "portrait",
    specs: {
      camera: "SONY A7III",
      lens: "FE 35MM F1.8",
      aperture: "f/2.8",
      shutter: "1/500s",
      iso: "ISO 100",
      location: "RATTANAKOSIN, BKK",
      year: "2026"
    }
  },
  {
    id: "frame-03",
    src: "/photos/03.jpg",
    alt: "Chao Phraya Pier Transit",
    title: "Chao Phraya Pier",
    subtitle: "River Geometry",
    series: "River Transit",
    category: "Architecture",
    caption: "Heavy concrete pontoons swaying in tidal river swell under noon sun.",
    width: 1600,
    height: 2400,
    orientation: "portrait",
    specs: {
      camera: "SONY A7III",
      lens: "FE 55MM F1.8 ZA",
      aperture: "f/4.0",
      shutter: "1/1000s",
      iso: "ISO 100",
      location: "CHAO PHRAYA, BKK",
      year: "2026"
    }
  },
  {
    id: "frame-04",
    src: "/photos/04.jpg",
    alt: "Silom Expressway Transit",
    title: "Expressway Centroid",
    subtitle: "Midnight Monolith",
    series: "Urban Geometry",
    category: "Street",
    caption: "Cantilevered overpasses cast in monolithic streetlamp amber.",
    width: 1600,
    height: 2400,
    orientation: "portrait",
    specs: {
      camera: "SONY A7III",
      lens: "FE 55MM F1.8 ZA",
      aperture: "f/1.8",
      shutter: "1/250s",
      iso: "ISO 800",
      location: "SILOM, BKK",
      year: "2026"
    }
  },
  {
    id: "frame-05",
    src: "/photos/05.jpg",
    alt: "Hua Hin Coastline Series",
    title: "Hua Hin Tide Line",
    subtitle: "Coastline Geometry",
    series: "Field Trip 2026",
    category: "Documentary",
    caption: "Morning low tide uncovering linear sandbars and early fishermen.",
    width: 1600,
    height: 2400,
    orientation: "portrait",
    specs: {
      camera: "SONY A7III",
      lens: "FE 35MM F1.8",
      aperture: "f/5.6",
      shutter: "1/800s",
      iso: "ISO 100",
      location: "HUA HIN",
      year: "2026"
    }
  },
  {
    id: "frame-06",
    src: "/photos/06.jpg",
    alt: "Talat Noi Machine Shop",
    title: "Talat Noi Mechanics",
    subtitle: "Old Engine Patina",
    series: "Bangkok Streets",
    category: "Street",
    caption: "Decades of engine oil and lathe shavings ground into sandstone flags.",
    width: 2400,
    height: 1600,
    orientation: "landscape",
    specs: {
      camera: "SONY A7III",
      lens: "FE 55MM F1.8 ZA",
      aperture: "f/2.8",
      shutter: "1/250s",
      iso: "ISO 400",
      location: "TALAT NOI, BKK",
      year: "2026"
    }
  }
];

export const siteProfile = {
  name: "Chakarin L.",
  alias: "BeamingMotion",
  role: "Street & Documentary Photography",
  location: "Bangkok, Thailand",
  coordinates: "13.7563° N, 100.5018° E",
  bio: {
    en: "Observational street and documentary photography centered on Bangkok's urban rhythm, candid human presence, and genuine moments. No staged sets, no pretension.",
    th: "ภาพถ่ายสตรีทและสารคดีเชิงสังเกตการณ์ที่บันทึกจังหวะชีวิตจริง แสงเงา และความเป็นไปของเมือง โดยไม่จัดฉาก ไม่ปรุงแต่ง"
  },
  gear: {
    system: "Sony α7 III",
    optics: ["FE 35mm F1.8", "Sonnar T* FE 55mm F1.8 ZA"],
    archive: "TU Photo 2026 · Personal Projects"
  },
  contact: {
    email: "chakarin.dev@gmail.com",
    instagram: "beamingmotion",
    instagramUrl: "https://instagram.com"
  }
};
