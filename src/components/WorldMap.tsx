import {
  geoEqualEarth,
  geoGraticule10,
  geoInterpolate,
  geoPath,
} from "d3-geo";
import { feature } from "topojson-client";
import worldData from "@/data/countries-110m.json";
import type { FeatureCollection, Geometry } from "geojson";

type CityMarker = {
  nameBn: string;
  countryBn: string;
  lat: number;
  lng: number;
  count: number;
};

const world = worldData as unknown as { objects: { countries: unknown } };
const countries = feature(
  world as never,
  world.objects.countries as never,
) as unknown as FeatureCollection<Geometry>;

const BANGLADESH: [number, number] = [90.3563, 23.685];

const projection = geoEqualEarth().fitExtent(
  [
    [12, 12],
    [988, 488],
  ],
  { type: "Sphere" } as never,
);
const path = geoPath(projection);

export function WorldMap({
  cities,
  showThreads = true,
  showLabels = false,
}: {
  cities: CityMarker[];
  showThreads?: boolean;
  showLabels?: boolean;
}) {
  const markers = cities
    .filter((city) => city.count > 0)
    .slice(0, 140)
    .map((city) => {
      const point = projection([city.lng, city.lat]);
      return point ? { ...city, x: point[0], y: point[1] } : null;
    })
    .filter((city): city is CityMarker & { x: number; y: number } => Boolean(city));

  const home = projection(BANGLADESH);
  const top = markers.slice(0, 14);

  return (
    <svg
      viewBox="0 0 1000 500"
      role="img"
      aria-label="বিশ্ব মানচিত্রে বাংলাদেশি প্রবাসীদের অবস্থান"
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <radialGradient id="pb-world-glow" cx="50%" cy="48%" r="62%">
          <stop offset="0%" stopColor="#14533e" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#04140f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1000" height="500" fill="#04150f" />
      <rect width="1000" height="500" fill="url(#pb-world-glow)" />

      <path d={path({ type: "Sphere" } as never) ?? ""} fill="#08251b" />

      <path
        d={path(geoGraticule10()) ?? ""}
        fill="none"
        stroke="rgba(247,241,230,0.06)"
        strokeWidth="0.7"
      />

      {countries.features.map((country) => {
        const isBd = String(country.id) === "050";
        return (
          <path
            key={String(country.id)}
            d={path(country) ?? ""}
            fill={isBd ? "rgba(244,42,65,0.82)" : "#123b2e"}
            stroke={
              isBd ? "rgba(255,217,154,0.9)" : "rgba(185,215,200,0.14)"
            }
            strokeWidth={isBd ? 1.1 : 0.5}
          />
        );
      })}

      {home ? (
        <g>
          <circle
            cx={home[0]}
            cy={home[1]}
            r="13"
            fill="rgba(255,217,154,0.12)"
          />
          <circle
            cx={home[0]}
            cy={home[1]}
            r="5"
            fill="#ffd99a"
            stroke="#fffdf8"
            strokeWidth="1.2"
          />
          {showLabels ? (
            <text
              x={home[0] + 10}
              y={home[1] + 4}
              fill="#ffd99a"
              fontSize="11"
              fontFamily="Hind Siliguri, sans-serif"
            >
              বাংলাদেশ
            </text>
          ) : null}
        </g>
      ) : null}

      {showThreads
        ? top.map((city) => {
            const interpolate = geoInterpolate(BANGLADESH, [city.lng, city.lat]);
            const points: string[] = [];
            for (let i = 0; i <= 28; i++) {
              const point = projection(interpolate(i / 28));
              if (point) points.push(`${point[0]},${point[1]}`);
            }
            return (
              <polyline
                key={city.nameBn}
                className="world-thread"
                points={points.join(" ")}
              />
            );
          })
        : null}

      {markers.map((city) => {
        const radius = Math.max(1.8, Math.min(5.4, 1.4 + Math.sqrt(city.count) * 0.6));
        return (
          <g key={`${city.nameBn}-${city.lat}`}>
            <circle
              className="world-marker"
              cx={city.x}
              cy={city.y}
              r={radius}
            >
              <title>{`${city.nameBn}, ${city.countryBn} — ${city.count} জন`}</title>
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
