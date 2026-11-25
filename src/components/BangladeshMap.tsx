import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "@/data/countries-110m.json";
import type { Feature, FeatureCollection, Geometry } from "geojson";

type DistrictDot = {
  slug: string;
  nameBn: string;
  lat: number;
  lng: number;
  count: number;
};

const world = worldData as unknown as { objects: { countries: unknown } };
const countries = feature(
  world as never,
  world.objects.countries as never,
) as unknown as FeatureCollection<Geometry>;

const bangladesh = countries.features.find(
  (country) => String(country.id) === "050",
) as Feature<Geometry> | undefined;

export function BangladeshMap({
  districts,
  activeSlug,
}: {
  districts: DistrictDot[];
  activeSlug?: string;
}) {
  if (!bangladesh) return null;

  const projection = geoMercator().fitExtent(
    [
      [34, 28],
      [386, 446],
    ],
    bangladesh,
  );
  const path = geoPath(projection);
  const outline = path(bangladesh) ?? "";

  const active = districts.find((district) => district.slug === activeSlug);
  const activePoint = active ? projection([active.lng, active.lat]) : null;

  return (
    <svg
      viewBox="0 0 420 474"
      role="img"
      aria-label="বাংলাদেশের মানচিত্রে জেলার অবস্থান"
    >
      <defs>
        <filter id="pb-bd-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="8"
            floodColor="#04140f"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      <g filter="url(#pb-bd-shadow)">
        <path
          d={outline}
          fill="#0d4f3b"
          stroke="rgba(185,215,200,0.55)"
          strokeWidth="1.3"
        />
      </g>

      {districts.map((district) => {
        const point = projection([district.lng, district.lat]);
        if (!point) return null;
        const isActive = district.slug === activeSlug;
        const radius = isActive
          ? 5.5
          : Math.max(1.7, Math.min(3.4, 1.5 + Math.sqrt(district.count) * 0.35));
        return (
          <g key={district.slug}>
            <circle
              cx={point[0]}
              cy={point[1]}
              r={radius}
              fill={isActive ? "#f42a41" : "rgba(255,217,154,0.72)"}
              stroke={isActive ? "#fff4de" : "rgba(4,20,15,0.6)"}
              strokeWidth={isActive ? 1.6 : 0.6}
              opacity={isActive ? 1 : 0.9}
            >
              <title>{`${district.nameBn} — ${district.count} জন প্রবাসী`}</title>
            </circle>
            {isActive ? (
              <circle
                cx={point[0]}
                cy={point[1]}
                r="12"
                fill="none"
                stroke="rgba(244,42,65,0.4)"
                strokeWidth="1.2"
              />
            ) : null}
          </g>
        );
      })}

      {activePoint && active ? (
        <g>
          <rect
            x={Math.min(300, Math.max(6, activePoint[0] - 52))}
            y={Math.max(8, activePoint[1] - 50)}
            width="104"
            height="28"
            rx="14"
            fill="rgba(4,20,15,0.9)"
            stroke="rgba(255,217,154,0.5)"
          />
          <text
            x={Math.min(352, Math.max(58, activePoint[0]))}
            y={Math.max(26, activePoint[1] - 31)}
            textAnchor="middle"
            fill="#ffd99a"
            fontSize="13"
            fontWeight="600"
            fontFamily="Hind Siliguri, sans-serif"
          >
            {active.nameBn}
          </text>
          <line
            x1={Math.min(352, Math.max(58, activePoint[0]))}
            y1={Math.max(36, activePoint[1] - 22)}
            x2={activePoint[0]}
            y2={activePoint[1] - 6}
            stroke="rgba(255,217,154,0.45)"
            strokeWidth="1"
          />
        </g>
      ) : null}

      <g fill="rgba(247,241,230,0.38)" fontSize="9" fontFamily="Inter, sans-serif">
        <text x="12" y="462">প্রবাসে · জেলা মানচিত্র</text>
      </g>
    </svg>
  );
}
