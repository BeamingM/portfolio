export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  series: string;
  caption: string;
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
    subtitle: "Monsoon Noir",
    series: "Bangkok Ephemera",
    caption: "Rain on asphalt. Wet neon reflections cutting through humid night air.",
    specs: {
      camera: "LEICA M11",
      lens: "35MM SUMMICRON",
      aperture: "f/2.0",
      shutter: "1/125s",
      iso: "ISO 400",
      location: "YAOWARAT, BKK",
      year: "2026"
    }
  },
  {
    id: "frame-02",
    src: "/photos/02.jpg",
    alt: "Morning Shadow & Solitude - Old Town",
    title: "Old Town Solitude",
    subtitle: "Quiet Light Study",
    series: "Bangkok Ephemera",
    caption: "Morning shadows elongating across cracked lime plaster walls.",
    specs: {
      camera: "SONY A7IV",
      lens: "FE 35MM F1.4 GM",
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
    alt: "Chao Phraya Brutalist Transit - River Geometry",
    title: "Chao Phraya Pier IV",
    subtitle: "Concrete & River",
    series: "River Constellations",
    caption: "Heavy concrete pontoons swaying in tidal river swell under noon sun.",
    specs: {
      camera: "LEICA M11",
      lens: "50MM SUMMILUX",
      aperture: "f/4.0",
      shutter: "1/1000s",
      iso: "ISO 64",
      location: "CHAO PHRAYA, BKK",
      year: "2026"
    }
  },
  {
    id: "frame-04",
    src: "/photos/04.jpg",
    alt: "Silom Expressway Geometry - Midnight Form",
    title: "Expressway Centroid",
    subtitle: "Midnight Monolith",
    series: "Urban Constructs",
    caption: "Cantilevered overpasses cast in monolithic streetlamp amber.",
    specs: {
      camera: "SONY A7IV",
      lens: "FE 50MM F1.2 GM",
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
    alt: "Dusit Architecture - Linear Shadows",
    title: "Dusit Grid Study",
    subtitle: "Linear Perspective",
    series: "Urban Constructs",
    caption: "Colonnades casting rhythmic diagonal lines across empty courtyards.",
    specs: {
      camera: "LEICA M11",
      lens: "35MM SUMMICRON",
      aperture: "f/5.6",
      shutter: "1/800s",
      iso: "ISO 100",
      location: "DUSIT, BKK",
      year: "2026"
    }
  },
  {
    id: "frame-06",
    src: "/photos/06.jpg",
    alt: "Talat Noi Alleys - Industrial Patina",
    title: "Talat Noi Machine Shop",
    subtitle: "Material Texture",
    series: "Bangkok Ephemera",
    caption: "Decades of engine oil and lathe shavings ground into sandstone flags.",
    specs: {
      camera: "CONTAX G2",
      lens: "PLANAR 45MM F2",
      aperture: "f/2.8",
      shutter: "1/250s",
      iso: "KODAK PORTRA 400",
      location: "TALAT NOI, BKK",
      year: "2026"
    }
  }
];

export const siteProfile = {
  name: "CHAKARIN L.",
  role: "Photographer & Visual Media",
  location: "Bangkok, Thailand",
  coordinates: "13.7563° N, 100.5018° E",
  bio: {
    en: "Observational photography centered on contemporary urban stillness, architecture, and poetic solitude in Bangkok. Design as craftsmanship and deliberate refinement.",
    th: "ภาพถ่ายเชิงสังเกตการณ์ที่เน้นความนิ่งสงบของรูปทรงเมือง สถาปัตยกรรม และจังหวะชีวิตอันโดดเดี่ยวในกรุงเทพฯ ด้วยแนวคิดการออกแบบเปรียบดั่งงานฝีมือประณีต"
  },
  gear: {
    bodies: ["Sony Alpha Series", "Leica M-System", "35mm Mechanical Film SLR"],
    optics: ["35mm Summicron", "50mm Summilux", "45mm Planar"],
    medium: ["14-bit Uncompressed Digital RAW", "Silver Halide Film"]
  },
  contact: {
    email: "chakarin.dev@gmail.com",
    instagram: "chakarin.l",
    instagramUrl: "https://instagram.com"
  }
};
