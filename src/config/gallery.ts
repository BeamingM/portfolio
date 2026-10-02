export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
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
    alt: "Visual Study 01 - Bangkok",
    title: "Frame 01",
    specs: {
      camera: "SONY A7IV",
      lens: "FE 35MM F1.4 GM",
      aperture: "f/1.4",
      shutter: "1/500s",
      iso: "ISO 100",
      location: "BANGKOK, TH",
      year: "2026"
    }
  },
  {
    id: "frame-02",
    src: "/photos/02.jpg",
    alt: "Visual Study 02 - Monochrome Shadow",
    title: "Frame 02",
    specs: {
      camera: "LEICA M11",
      lens: "35MM SUMMICRON",
      aperture: "f/2.0",
      shutter: "1/1000s",
      iso: "ISO 64",
      location: "OLD TOWN, BKK",
      year: "2026"
    }
  },
  {
    id: "frame-03",
    src: "/photos/03.jpg",
    alt: "Visual Study 03 - Architecture & Light",
    title: "Frame 03",
    specs: {
      camera: "SONY A7IV",
      lens: "FE 50MM F1.2 GM",
      aperture: "f/1.8",
      shutter: "1/800s",
      iso: "ISO 200",
      location: "CHAO PHRAYA",
      year: "2026"
    }
  },
  {
    id: "frame-04",
    src: "/photos/04.jpg",
    alt: "Visual Study 04 - Midnight Geometry",
    title: "Frame 04",
    specs: {
      camera: "CONTAX G2",
      lens: "PLANAR 45MM F2",
      aperture: "f/2.8",
      shutter: "1/250s",
      iso: "KODAK PORTRA 400",
      location: "SILOM, BKK",
      year: "2026"
    }
  }
];

export const siteProfile = {
  name: "CHAKARIN L.",
  role: "Visual Media / Photographer",
  location: "Bangkok, Thailand",
  coordinates: "13.7563° N, 100.5018° E",
  bio: {
    en: "Observational photography exploring contemporary urban forms, quiet moments, and human presence in transit.",
    th: "ภาพถ่ายเชิงสังเกตการณ์ สำรวจรูปทรงเมืองร่วมสมัย จังหวะเงียบสงบ และการดำรงอยู่ของผู้คนในการเคลื่อนที่"
  },
  gear: {
    bodies: ["Sony Alpha", "Leica M-System", "35mm Film SLR"],
    optics: ["Prime Lenses (35mm / 50mm)"],
    medium: ["Digital 14-bit RAW", "35mm Analog Film"]
  },
  contact: {
    email: "chakarin.dev@gmail.com",
    instagram: "chakarin.l",
    instagramUrl: "https://instagram.com"
  }
};
