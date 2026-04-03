/** Shared regional sites + globe metadata (ISO A2 matches Natural Earth geojson). */

export interface GlobeLocation {
  name: string;
  lat: number;
  lng: number;
  url: string;
  /** Emoji fallback for labels / CSS globe */
  flag: string;
  /** Public path under /public */
  flagSrc: string;
  isoA2: string;
  color: string;
  desc: string;
  isHub?: boolean;
  domain?: string;
  city?: string;
}

export const GLOBE_LOCATIONS: GlobeLocation[] = [
  {
    name: "United States",
    lat: 39.5,
    lng: -98.3,
    url: "#contact",
    flag: "🇺🇸",
    flagSrc: "/img/flags/us.svg",
    isoA2: "US",
    color: "#60A5FA",
    desc: "gmdfences.com",
    isHub: true,
    domain: "gmdfences.com",
    city: "Under Development",
  },
  {
    name: "Romania",
    lat: 45.9,
    lng: 24.9,
    url: "https://gardurimd.ro",
    flag: "🇷🇴",
    flagSrc: "/img/flags/ro.svg",
    isoA2: "RO",
    color: "#F4C430",
    desc: "gardurimd.ro",
    domain: "gardurimd.ro",
    city: "Bucharest",
  },
  {
    name: "Moldova",
    lat: 47.0,
    lng: 28.9,
    url: "https://garduri.md",
    flag: "🇲🇩",
    flagSrc: "/img/flags/md.svg",
    isoA2: "MD",
    color: "#F4C430",
    desc: "garduri.md",
    domain: "garduri.md",
    city: "Chișinău",
  },
  {
    name: "Bulgaria",
    lat: 42.7,
    lng: 25.5,
    url: "https://ogradigmd.bg",
    flag: "🇧🇬",
    flagSrc: "/img/flags/bg.svg",
    isoA2: "BG",
    color: "#F4C430",
    desc: "ogradigmd.bg",
    domain: "ogradigmd.bg",
    city: "Sofia",
  },
  {
    name: "Ireland",
    lat: 53.35,
    lng: -6.26,
    url: "https://finefence.ie/",
    flag: "🇮🇪",
    flagSrc: "/img/flags/ie.svg",
    isoA2: "IE",
    color: "#F4C430",
    desc: "finefence.ie",
    domain: "finefence.ie",
    city: "Dublin",
  },
];

/** Europe + Ireland sites shown as outbound cards (US is separate HQ card on the page). */
export const REGIONAL_SITE_CARDS = GLOBE_LOCATIONS.filter((l) => !l.isHub);

export function getGlobeLocationByName(name: string): GlobeLocation | undefined {
  return GLOBE_LOCATIONS.find((l) => l.name === name);
}
