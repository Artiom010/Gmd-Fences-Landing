"use client";

import { useState, useEffect, useRef, useCallback, Component, type ReactNode } from "react";
import {
  GLOBE_LOCATIONS as LOCATIONS,
  type GlobeLocation as Location,
  getGlobeLocationByName,
} from "@/lib/regions";

const GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/vasturiano/globe.gl@master/example/datasets/ne_110m_admin_0_countries.geojson";

const ZOOM_ALT = 0.38;
/** USA is large — use a higher altitude so the view sits further from the globe. */
const ZOOM_ALT_US = 0.56;
const OVERVIEW_ALT = 2.05;
const GLOBE_MIN_PX = 280;
/** Hard cap for WebGL canvas (larger = sharper on big screens, more GPU). */
const GLOBE_CANVAS_MAX_PX = 960;

/** Square canvas inscribed in the element — uses both axes so it fills height & width together. */
function measureGlobeSize(el: HTMLElement) {
  const w = el.clientWidth || GLOBE_MIN_PX;
  const h = el.clientHeight || GLOBE_MIN_PX;
  const side = Math.min(w, h);
  return Math.min(Math.max(side, GLOBE_MIN_PX), GLOBE_CANVAS_MAX_PX);
}

class GlobeErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export interface InteractiveGlobeProps {
  onLocationSelect?: (loc: Location) => void;
  flyToRequest?: { key: number; name: string } | null;
}

function WebGLGlobe({
  onSelect,
  flyToRequest,
}: {
  onSelect?: (loc: Location) => void;
  flyToRequest?: { key: number; name: string } | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // globe.gl instance — chainable API; typed loosely for TS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const onSelectRef = useRef(onSelect);
  const [active, setActive] = useState("United States");
  const [selectedIso, setSelectedIso] = useState("US");
  // Runtime API is Globe()(el); bundled .d.ts describes `new Globe(el)` — use any here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [GlobeCtor, setGlobeCtor] = useState<any>(null);
  const [countryFeatures, setCountryFeatures] = useState<Array<{ properties?: { ISO_A2?: string } }> | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const navigateTo = useCallback((loc: Location, openLink: boolean) => {
    const globe = globeRef.current;
    setActive(loc.name);
    setSelectedIso(loc.isoA2);
    if (globe) {
      const alt = loc.isoA2 === "US" ? ZOOM_ALT_US : ZOOM_ALT;
      globe.pointOfView({ lat: loc.lat, lng: loc.lng, altitude: alt }, 1100);
      globe.controls().autoRotate = false;
      globe.controls().enableZoom = true;
    }
    if (openLink) onSelectRef.current?.(loc);
  }, []);

  useEffect(() => {
    import("globe.gl")
      .then((m) => setGlobeCtor(() => (m as { default: unknown }).default))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((data: { features?: Array<{ properties?: { ISO_A2?: string } }> }) => {
        const feats = (data.features ?? []).filter(
          (f) => f.properties?.ISO_A2 && f.properties.ISO_A2 !== "AQ"
        );
        setCountryFeatures(feats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!GlobeCtor || !containerRef.current) return;
    const el = containerRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globe: any = GlobeCtor()(el) as any;
    globeRef.current = globe;

    const applyDimensions = () => {
      const s = measureGlobeSize(el);
      globe.width(s).height(s);
    };
    applyDimensions();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(applyDimensions) : null;
    ro?.observe(el);

    globe
      .backgroundColor("rgba(0,0,0,0)")
      .showAtmosphere(false)
      .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
      .pointsData(LOCATIONS)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor((d: Location) =>
        d.name === active ? d.color : "rgba(200, 210, 220, 0.38)"
      )
      .pointAltitude(0.01)
      .pointRadius((d: Location) => (d.name === active ? 0.35 : 0.22))
      .pointResolution(12)
      .labelsData([getGlobeLocationByName("United States") ?? LOCATIONS[0]])
      .labelLat("lat")
      .labelLng("lng")
      .labelText("name")
      .labelSize(0.88)
      .labelDotRadius(0.18)
      .labelColor((d: Location) => d.color)
      .labelResolution(2)
      .labelAltitude(0.018)
      .polygonsData([])
      .onPointClick((d: Location) => navigateTo(d, true))
      .onLabelClick((d: Location) => navigateTo(d, true));

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.22;
    globe.controls().enableZoom = true;
    globe.pointOfView({ lat: 44, lng: -10, altitude: OVERVIEW_ALT });

    return () => {
      ro?.disconnect();
      globeRef.current = null;
      el.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once when ctor loads; active synced below
  }, [GlobeCtor, navigateTo]);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const one = getGlobeLocationByName(active);
    g.labelsData(one ? [one] : []);
    g.pointColor((d: Location) =>
      d.name === active ? d.color : "rgba(200, 210, 220, 0.42)"
    );
    g.pointRadius((d: Location) => (d.name === active ? 0.35 : 0.22));
  }, [active]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !countryFeatures?.length) return;
    const one = countryFeatures.filter((f) => f.properties?.ISO_A2 === selectedIso);
    globe
      .polygonsData(one)
      .polygonAltitude(0.012)
      .polygonSideColor(() => "rgba(13, 21, 32, 0.92)")
      .polygonStrokeColor(() => "rgba(244, 196, 48, 0.35)")
      .polygonCapColor(() => "rgba(244, 196, 48, 0.78)")
      .polygonsTransitionDuration(280);
  }, [selectedIso, countryFeatures]);

  useEffect(() => {
    if (!flyToRequest) return;
    const loc = getGlobeLocationByName(flyToRequest.name);
    if (loc) navigateTo(loc, false);
  }, [flyToRequest?.key, flyToRequest?.name, navigateTo]);

  return (
    <div className="mx-auto w-full max-w-[min(100%,56rem)] overflow-visible">
      <div className="overflow-visible px-1 py-4 sm:px-2 sm:py-6">
        <div
          ref={containerRef}
          className="mx-auto aspect-square w-[min(100%,min(88dvh,920px))] max-w-full overflow-hidden rounded-full bg-slate-100 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/90 [&_canvas]:block [&_canvas]:max-h-none [&_canvas]:max-w-none"
          aria-hidden="true"
        />
      </div>
      <p className="text-center text-xs text-slate-500">Drag to rotate · click a marker to open that region</p>
      <div className="relative z-20 mt-3 mb-1 flex flex-wrap justify-center gap-2 px-2 pb-2">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            type="button"
            onClick={() => navigateTo(loc, false)}
            className={`relative inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
              active === loc.name
                ? "border-[#0D1520] bg-[#0D1520] text-white shadow-md after:absolute after:left-1/2 after:top-full after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-[7px] after:border-t-[8px] after:border-x-transparent after:border-t-[#0D1520] after:content-['']"
                : "border-slate-300 bg-white text-slate-600 shadow-sm hover:border-slate-400 hover:text-[#0D1520]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={loc.flagSrc} alt="" className="h-4 w-6 rounded-sm object-cover shadow-sm" />
            {loc.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function InteractiveGlobe({ onLocationSelect, flyToRequest }: InteractiveGlobeProps) {
  return (
    <GlobeErrorBoundary
      fallback={
        <div className="mx-auto flex aspect-square w-[min(100%,min(88dvh,920px))] max-w-full flex-col items-center justify-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-600">
          <p className="font-semibold text-[#0D1520]">3D globe unavailable</p>
          <p className="text-slate-500">Try another browser or enable WebGL.</p>
        </div>
      }
    >
      <WebGLGlobe onSelect={onLocationSelect} flyToRequest={flyToRequest} />
    </GlobeErrorBoundary>
  );
}
