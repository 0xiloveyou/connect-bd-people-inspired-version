"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ComposableMap,
  Geographies,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import type { FeatureCollection, Geometry } from "geojson";
import { Loader2, Minus, Plus, Search, Users } from "lucide-react";
import { Avatar } from "./Avatar";
import { bn } from "@/lib/format";
import { regionForCountry, regionOrder } from "@/lib/regions";
import type { MapCity } from "@/lib/queries";
import { BANGLADESH_COORDS, BANGLADESH_FEATURE_ID } from "@/lib/world";

type MemberLite = {
  id: number;
  name: string;
  avatarColor: string;
  photoUrl: string | null;
  profession: string | null;
  yearsAbroad: number;
  district: { nameBn: string } | null;
};

const MAP_WIDTH = 820;
const MAP_HEIGHT = 450;

export function MapExplorer({
  cities,
  geo,
  totals,
}: {
  cities: MapCity[];
  geo: FeatureCollection<Geometry>;
  totals: { total: number; cityCount: number; countryCount: number; districtCount: number };
}) {
  const [region, setRegion] = useState("সব");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<number | null>(cities[0]?.id ?? null);
  const [zoom, setZoom] = useState(1);
  const [members, setMembers] = useState<MemberLite[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cities.filter((city) => {
      const inRegion =
        region === "সব" || regionForCountry(city.countryCode) === region;
      if (!inRegion) return false;
      if (!q) return true;
      return [city.name, city.nameBn, city.country, city.countryBn]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [cities, region, query]);

  // The visible selection always falls back to the first city in the filter.
  const activeCity =
    filtered.find((city) => city.id === activeId) ?? filtered[0] ?? null;

  useEffect(() => {
    abortRef.current?.abort();
    if (!activeCity) return;

    const controller = new AbortController();
    abortRef.current = controller;
    let alive = true;

    const load = async () => {
      setLoading(true);
      setMembers([]);
      try {
        const response = await fetch(`/api/members?cityId=${activeCity.id}&limit=8`, {
          signal: controller.signal,
        });
        const data = response.ok
          ? ((await response.json()) as { members?: MemberLite[] })
          : { members: [] };
        if (alive) setMembers(data.members ?? []);
      } catch (error) {
        if ((error as { name?: string })?.name === "AbortError") return;
      } finally {
        if (alive) setLoading(false);
      }
    };

    void load();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [activeCity]);

  const pick = (id: number) => setActiveId(id);

  const markers = filtered.slice(0, 180);
  const home = BANGLADESH_COORDS;

  return (
    <>
      <div className="map-toolbar">
        <div className="map-chips" role="group" aria-label="অঞ্চল অনুযায়ী ছাঁকো">
          {regionOrder.map((item) => (
            <button
              key={item}
              type="button"
              className="map-chip"
              data-active={region === item}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="map-search">
          <Search size={15} aria-hidden="true" />
          <span className="sr-only">শহর বা দেশ খোঁজো</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="শহর বা দেশ খোঁজো…"
            type="search"
          />
        </label>
      </div>

      <div className="map-layout">
        <div className="map-frame">
          <div className="map-zoom">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(6, Number((value + 0.5).toFixed(2))))}
              disabled={zoom >= 6}
              aria-label="জুম ইন"
            >
              <Plus size={17} />
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(1, Number((value - 0.5).toFixed(2))))}
              disabled={zoom <= 1}
              aria-label="জুম আউট"
            >
              <Minus size={17} />
            </button>
          </div>

          <ComposableMap
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            projection="geoEqualEarth"
            projectionConfig={{ scale: 148, center: [8, 2] }}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%" }}
            aria-label="বিশ্ব মানচিত্রে প্রবাসী বাংলাদেশিরা"
          >
            <ZoomableGroup
              zoom={zoom}
              minZoom={1}
              maxZoom={6}
              center={[8, 2]}
              onMoveEnd={({ zoom: nextZoom }) => {
                if (typeof nextZoom === "number" && Number.isFinite(nextZoom)) {
                  setZoom(Math.min(6, Math.max(1, Number(nextZoom.toFixed(2)))));
                }
              }}
            >
              <Geographies geography={geo}>
                {({ geographies }) =>
                  geographies.map((geography) => {
                    const isBd = String(geography.id) === BANGLADESH_FEATURE_ID;
                    return (
                      <path
                        key={geography.rsmKey}
                        d={geography.svgPath ?? undefined}
                        fill={isBd ? "rgba(244,42,65,0.78)" : "#123b2e"}
                        stroke={
                          isBd
                            ? "rgba(255,217,154,0.9)"
                            : "rgba(185,215,200,0.14)"
                        }
                        strokeWidth={isBd ? 1.2 : 0.5}
                      />
                    );
                  })
                }
              </Geographies>

              <Marker coordinates={home}>
                <circle r={10} fill="rgba(255,217,154,0.16)" />
                <circle
                  r={4.5}
                  fill="#ffd99a"
                  stroke="#fffdf8"
                  strokeWidth={1.2}
                />
                <text
                  textAnchor="middle"
                  y={-15}
                  fill="#ffd99a"
                  fontSize={11}
                  fontFamily="Hind Siliguri, sans-serif"
                >
                  বাংলাদেশ
                </text>
              </Marker>

              {markers.map((city) => {
                const active = city.id === activeCity?.id;
                const radius = Math.max(3.2, Math.min(11, 2.6 + Math.sqrt(city.count) * 1.1));
                return (
                  <Marker key={city.id} coordinates={[city.lng, city.lat]}>
                    <g
                      className={`map-pin${active ? " map-pin-active" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${city.nameBn}, ${city.countryBn} — ${city.count} জন`}
                      onClick={() => pick(city.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          pick(city.id);
                        }
                      }}
                    >
                      <circle
                        r={radius * 2.1}
                        fill="rgba(255,217,154,0.14)"
                        opacity={active ? 1 : 0.65}
                      />
                      <circle
                        className="pin-core"
                        r={radius}
                        fill="#ffd99a"
                        fillOpacity={active ? 1 : 0.78}
                        stroke="#04140f"
                        strokeWidth={0.7}
                      />
                      <title>{`${city.nameBn}, ${city.countryBn} — ${city.count} জন প্রবাসী`}</title>
                    </g>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>

          {activeCity ? (
            <div
              style={{
                position: "absolute",
                left: 14,
                top: 14,
                zIndex: 4,
                maxWidth: "min(320px, calc(100% - 90px))",
              }}
            >
              <div className="map-detail">
                <b>{activeCity.nameBn}</b>
                <span>{activeCity.countryBn}</span>
                <span className="count">
                  {bn(activeCity.count)} জন প্রবাসী এই শহরে
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="map-side">
          <div className="map-side-panel">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <h3>{region === "সব" ? "শহরগুলো" : region}</h3>
              <span className="muted" style={{ fontSize: 12 }}>
                {bn(filtered.length)} শহর
              </span>
            </div>

            <div className="map-side-list">
              {filtered.length === 0 ? (
                <p className="map-selected-empty" style={{ padding: "12px 4px" }}>
                  এই ছাঁকনিতে কোনো শহর পাওয়া যায়নি। অন্য অঞ্চল বা নাম চেষ্টা করো।
                </p>
              ) : (
                filtered.slice(0, 80).map((city, index) => (
                  <button
                    key={city.id}
                    type="button"
                    className="map-side-row"
                    data-active={city.id === activeCity?.id}
                    onClick={() => pick(city.id)}
                  >
                    <span className="map-side-rank">{bn(index + 1)}</span>
                    <span className="map-side-name">
                      <b>{city.nameBn}</b>
                      <small>{city.countryBn}</small>
                    </span>
                    <span className="map-side-count">{bn(city.count)}</span>
                  </button>
                ))
              )}
            </div>

            {activeCity ? (
              <div className="map-selected-card">
                <div className="map-selected-head">
                  <div>
                    <b>{activeCity.nameBn}</b>
                    <span style={{ display: "block" }}>
                      {activeCity.countryBn} · {activeCity.country}
                    </span>
                  </div>
                  <span className="map-selected-count">
                    {bn(activeCity.count)} জন
                  </span>
                </div>

                {loading ? (
                  <p className="map-selected-empty">
                    <Loader2
                      size={13}
                      className="spin"
                      style={{ display: "inline", verticalAlign: -2, marginRight: 5 }}
                    />
                    প্রবাসীদের খোঁজা হচ্ছে…
                  </p>
                ) : members.length === 0 ? (
                  <p className="map-selected-empty">
                    এই শহরে এখনো কেউ নাম লিখনি।{" "}
                    <Link href="/join" style={{ color: "var(--green-700)", fontWeight: 600 }}>
                      তুমিই প্রথম হও →
                    </Link>
                  </p>
                ) : (
                  <div className="map-selected-people">
                    {members.slice(0, 6).map((member) => (
                      <Link
                        key={member.id}
                        href={`/card/${member.id}`}
                        className="map-selected-person"
                      >
                        <Avatar
                          name={member.name}
                          color={member.avatarColor}
                          photoUrl={member.photoUrl}
                          size={24}
                        />
                        <span style={{ flex: 1, minWidth: 0 }}>
                          {member.name}
                          {member.district ? ` · ${member.district.nameBn}` : ""}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  href="/join"
                  className="btn btn-outline btn-sm btn-block"
                  style={{ marginTop: 2 }}
                >
                  <Users size={14} /> এই শহরে যোগ দাও
                </Link>
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      <p className="map-note">
        <Users size={13} aria-hidden="true" />
        {bn(totals.countryCount)} দেশের {bn(totals.cityCount)} শহরে {bn(totals.total)}{" "}
        জন প্রবাসী · {bn(totals.districtCount)} জেলা থেকে · মানচিত্রে পিনে ক্লিক করে
        শহরভিত্তিক প্রবাসীদের দেখো।
      </p>
    </>
  );
}
