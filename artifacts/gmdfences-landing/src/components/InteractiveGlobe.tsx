import { useState, useEffect, useRef, Component, ReactNode } from "react";

interface Location {
  name: string;
  lat: number;
  lng: number;
  url: string;
  flag: string;
  color: string;
  desc: string;
  isHub?: boolean;
}

export const LOCATIONS: Location[] = [
  { name: "Romania",  lat: 45.9,  lng: 24.9,  url: "https://gardurimd.ro",  flag: "🇷🇴", color: "#F4C430", desc: "gardurimd.ro" },
  { name: "Moldova",  lat: 47.0,  lng: 28.9,  url: "https://garduri.md",    flag: "🇲🇩", color: "#F4C430", desc: "garduri.md"   },
  { name: "Bulgaria", lat: 42.7,  lng: 25.5,  url: "https://ogradigmd.bg",  flag: "🇧🇬", color: "#F4C430", desc: "ogradigmd.bg" },
  { name: "USA",      lat: 39.5,  lng: -98.3, url: "#contact",              flag: "🇺🇸", color: "#60A5FA", desc: "gmdfences.com", isHub: true },
];

// ── Error Boundary ────────────────────────────────────────────────────────────
class GlobeErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// ── Orthographic projection helper ────────────────────────────────────────────
function project(lat: number, lng: number, centerLat: number, centerLng: number, R: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const φ = toRad(lat), λ = toRad(lng), φ0 = toRad(centerLat), λ0 = toRad(centerLng);
  const x = R * Math.cos(φ) * Math.sin(λ - λ0);
  const y = -R * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ - λ0));
  const visible = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ - λ0) > 0;
  return { x, y, visible };
}

// ── SVG Graticule lines ───────────────────────────────────────────────────────
function Graticule({ centerLat, centerLng, R }: { centerLat: number; centerLng: number; R: number }) {
  const lines: string[] = [];
  // Latitude circles
  for (let lat = -60; lat <= 90; lat += 30) {
    const pts: string[] = [];
    for (let lng = -180; lng <= 180; lng += 4) {
      const { x, y, visible } = project(lat, lng, centerLat, centerLng, R);
      if (visible) pts.push(`${R + x},${R + y}`);
    }
    if (pts.length > 2) lines.push(pts.join(" "));
  }
  // Longitude meridians
  for (let lng = -180; lng < 180; lng += 30) {
    const pts: string[] = [];
    for (let lat = -90; lat <= 90; lat += 4) {
      const { x, y, visible } = project(lat, lng, centerLat, centerLng, R);
      if (visible) pts.push(`${R + x},${R + y}`);
    }
    if (pts.length > 2) lines.push(pts.join(" "));
  }
  return (
    <>
      {lines.map((pts, i) => (
        <polyline key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      ))}
    </>
  );
}

// ── CSS Globe fallback ────────────────────────────────────────────────────────
function CSSGlobe({ onSelect }: { onSelect?: (loc: Location) => void }) {
  const [active, setActive] = useState("USA");
  const [centerLat, setCenterLat] = useState(44);
  const [centerLng, setCenterLng] = useState(-10); // centered so both USA and Europe visible
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOrigin, setDragOrigin] = useState({ lat: 44, lng: -10 });
  const animRef = useRef<number | null>(null);
  const autoRotateRef = useRef(true);

  // Auto-rotate
  useEffect(() => {
    let last = 0;
    const tick = (ts: number) => {
      if (autoRotateRef.current && !dragging) {
        const dt = ts - last;
        if (dt > 16) {
          setCenterLng(l => l + 0.12);
          last = ts;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [dragging]);

  const flyTo = (loc: Location) => {
    autoRotateRef.current = false;
    setActive(loc.name);
    // Animate to location
    let step = 0;
    const startLat = centerLat, startLng = centerLng;
    let targetLng = loc.lng - 15;
    // Normalize
    const diff = ((targetLng - startLng) % 360 + 540) % 360 - 180;
    targetLng = startLng + diff;
    const frames = 40;
    const anim = () => {
      step++;
      const t = step / frames;
      const ease = 1 - Math.pow(1 - t, 3);
      setCenterLat(startLat + (loc.lat * 0.3 - startLat) * ease);
      setCenterLng(startLng + (targetLng - startLng) * ease);
      if (step < frames) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
    onSelect?.(loc);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    autoRotateRef.current = false;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOrigin({ lat: centerLat, lng: centerLng });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setCenterLng(dragOrigin.lng - dx * 0.4);
    setCenterLat(Math.max(-60, Math.min(60, dragOrigin.lat + dy * 0.25)));
  };
  const handleMouseUp = () => setDragging(false);

  const R = 150; // radius

  return (
    <div className="relative w-full flex flex-col items-center gap-6 select-none">
      {/* Globe */}
      <div
        className="relative cursor-grab active:cursor-grabbing"
        style={{ width: R * 2, height: R * 2 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg width={R * 2} height={R * 2} style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="globeGrad" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#2a6fa0" />
              <stop offset="40%" stopColor="#1a4d7a" />
              <stop offset="100%" stopColor="#0a1f35" />
            </radialGradient>
            <radialGradient id="gloss" cx="30%" cy="25%" r="55%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <clipPath id="globeClip">
              <circle cx={R} cy={R} r={R} />
            </clipPath>
            <filter id="atmo">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* Atmosphere glow */}
          <circle cx={R} cy={R} r={R + 12} fill="rgba(30,100,200,0.15)" filter="url(#atmo)" />

          <g clipPath="url(#globeClip)">
            {/* Ocean */}
            <circle cx={R} cy={R} r={R} fill="url(#globeGrad)" />
            {/* Graticule */}
            <Graticule centerLat={centerLat} centerLng={centerLng} R={R} />
            {/* Land masses (simplified Europe + Americas blobs) */}
            {LANDMASSES.map((land, li) => {
              const pts = land.coords.map(([lat, lng]) => {
                const { x, y } = project(lat, lng, centerLat, centerLng, R);
                return `${R + x},${R + y}`;
              }).join(" ");
              const centerPt = land.coords[0];
              const { visible } = project(centerPt[0], centerPt[1], centerLat, centerLng, R);
              if (!visible) return null;
              return <polygon key={li} points={pts} fill="#2d6a2a" opacity={0.7} />;
            })}
            {/* Gloss */}
            <circle cx={R} cy={R} r={R} fill="url(#gloss)" />
          </g>

          {/* Markers */}
          {LOCATIONS.map(loc => {
            const { x, y, visible } = project(loc.lat, loc.lng, centerLat, centerLng, R);
            if (!visible) return null;
            const isActive = active === loc.name;
            return (
              <g
                key={loc.name}
                transform={`translate(${R + x}, ${R + y})`}
                style={{ cursor: "pointer" }}
                onClick={() => flyTo(loc)}
              >
                {/* Pulse ring */}
                {isActive && (
                  <circle r="14" fill="none" stroke={loc.color} strokeWidth="1.5" opacity="0.4">
                    <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle r={isActive ? 8 : 6} fill={loc.color} stroke="white" strokeWidth="1.5" />
                {/* Label */}
                <text y="-14" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" style={{ pointerEvents: "none" }}>
                  {loc.flag} {loc.name}
                </text>
              </g>
            );
          })}

          {/* Rim */}
          <circle cx={R} cy={R} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        </svg>
        {/* Drag hint */}
        <p className="absolute bottom-[-22px] left-0 right-0 text-center text-white/25 text-[10px]">Drag to rotate</p>
      </div>

      {/* Country buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {LOCATIONS.map(loc => (
          <button
            key={loc.name}
            onClick={() => flyTo(loc)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
              active === loc.name
                ? "bg-[#F4C430] text-[#1B2537] border-[#F4C430] shadow-lg shadow-[#F4C430]/20"
                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-[#F4C430]/40"
            }`}
          >
            <span className="text-base">{loc.flag}</span>
            <span>{loc.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Simplified land mass polygons (lat/lng pairs)
const LANDMASSES = [
  // Western Europe
  { coords: [[43,0],[48,-2],[54,8],[58,10],[62,5],[65,14],[58,20],[55,18],[50,14],[46,14],[44,10],[43,0]] as [number,number][] },
  // Eastern Europe
  { coords: [[48,14],[55,18],[58,20],[60,30],[55,37],[50,37],[46,30],[44,22],[48,14]] as [number,number][] },
  // Scandinavia
  { coords: [[58,5],[65,14],[70,25],[72,28],[68,18],[65,14],[62,5],[58,5]] as [number,number][] },
  // North America east
  { coords: [[25,-80],[45,-70],[50,-66],[55,-60],[50,-55],[45,-60],[40,-70],[30,-80],[25,-80]] as [number,number][] },
  // North America west
  { coords: [[25,-100],[35,-120],[48,-125],[55,-130],[60,-140],[50,-130],[45,-125],[35,-120],[25,-100]] as [number,number][] },
  // North America central
  { coords: [[25,-80],[25,-100],[35,-120],[48,-125],[50,-66],[45,-70],[25,-80]] as [number,number][] },
  // Asia (simplified)
  { coords: [[35,35],[45,40],[55,50],[60,60],[55,80],[40,70],[30,60],[35,50],[30,40],[35,35]] as [number,number][] },
  // Africa
  { coords: [[37,10],[37,35],[25,40],[10,42],[-5,40],[-30,30],[-35,20],[-30,10],[-15,-15],[0,-15],[15,-17],[30,-15],[37,10]] as [number,number][] },
  // South America
  { coords: [[12,-70],[10,-60],[0,-50],[-10,-35],[-30,-50],[-55,-70],[-40,-65],[-20,-45],[-5,-35],[5,-50],[12,-70]] as [number,number][] },
  // Australia
  { coords: [[-20,115],[-15,130],[-20,140],[-30,150],[-40,148],[-38,140],[-35,135],[-30,115],[-20,115]] as [number,number][] },
];

// ── WebGL Globe (globe.gl) ────────────────────────────────────────────────────
function WebGLGlobe({ onSelect }: { onSelect?: (loc: Location) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [active, setActive] = useState("USA");
  const [GlobeGL, setGlobeGL] = useState<any>(null);

  useEffect(() => {
    import("globe.gl").then(mod => setGlobeGL(() => mod.default)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!GlobeGL || !containerRef.current) return;
    const el = containerRef.current;

    const globe = GlobeGL()(el);
    globeRef.current = globe;
    globe
      .width(el.clientWidth || 380).height(el.clientHeight || 380)
      .backgroundColor("rgba(0,0,0,0)")
      .showAtmosphere(true)
      .atmosphereColor("#1B4FD8")
      .atmosphereAltitude(0.18)
      .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
      .pointsData(LOCATIONS)
      .pointLat("lat").pointLng("lng")
      .pointColor((d: any) => d.color)
      .pointAltitude(0.02).pointRadius(0.8).pointResolution(32)
      .labelsData(LOCATIONS).labelLat("lat").labelLng("lng")
      .labelText("name").labelSize(1.4).labelDotRadius(0.35)
      .labelColor((d: any) => d.color).labelResolution(3).labelAltitude(0.025)
      .onPointClick((d: any) => flyTo(d))
      .onLabelClick((d: any) => flyTo(d));

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.4;
    globe.controls().enableZoom = false;
    globe.pointOfView({ lat: 44, lng: -10, altitude: 2.0 });

    function flyTo(d: any) {
      setActive(d.name);
      globe.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.8 }, 900);
      globe.controls().autoRotate = false;
      onSelect?.(d);
    }

    return () => { el.innerHTML = ""; };
  }, [GlobeGL]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={containerRef} style={{ width: 380, height: 380 }} />
      <div className="flex flex-wrap justify-center gap-3">
        {LOCATIONS.map(loc => (
          <button key={loc.name}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
              active === loc.name ? "bg-[#F4C430] text-[#1B2537] border-[#F4C430] shadow-lg" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
            }`}
          >
            <span>{loc.flag}</span><span>{loc.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Public export — tries WebGL, falls back to CSS ────────────────────────────
interface Props { onLocationSelect?: (loc: Location) => void; }

export default function InteractiveGlobe({ onLocationSelect }: Props) {
  return (
    <GlobeErrorBoundary fallback={<CSSGlobe onSelect={onLocationSelect} />}>
      <WebGLGlobe onSelect={onLocationSelect} />
    </GlobeErrorBoundary>
  );
}
