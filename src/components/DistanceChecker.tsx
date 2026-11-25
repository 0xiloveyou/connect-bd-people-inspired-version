"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Clock3, Crosshair, Home, MapPin, ShieldCheck } from "lucide-react";
import { PlacePicker, type PickerOption } from "./PlacePicker";
import { haversineKm } from "@/lib/distance";
import { bn } from "@/lib/format";

export type DistanceCity = {
  id: number;
  slug: string;
  name: string;
  nameBn: string;
  countryBn: string;
  lat: number;
  lng: number;
};

export type DistanceDistrict = {
  id: number;
  slug: string;
  nameBn: string;
  divisionBn: string;
  lat: number;
  lng: number;
};

function timeAt(longitude: number): string {
  // A light-weight, longitude-based clock hint. Not a substitute for a tz database.
  const now = new Date();
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const offset = Math.round(longitude / 15) * 60;
  const total = (utcMinutes + offset + 24 * 60) % (24 * 60);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  const suffix = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const text = `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
  return text.replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
}

export function DistanceChecker({
  cities,
  districts,
}: {
  cities: DistanceCity[];
  districts: DistanceDistrict[];
}) {
  const defaultFrom =
    cities.find((city) => city.slug === "riyadh")?.id.toString() ??
    cities[0]?.id.toString() ??
    "";
  const defaultTo =
    districts.find((district) => district.slug === "dhaka")?.id.toString() ??
    districts[0]?.id.toString() ??
    "";

  const [fromId, setFromId] = useState(defaultFrom);
  const [toId, setToId] = useState(defaultTo);
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState("");
  const [geoError, setGeoError] = useState("");

  const cityOptions: PickerOption[] = useMemo(
    () =>
      cities.map((city) => ({
        value: city.id.toString(),
        label: city.nameBn,
        sub: city.countryBn,
        group: city.countryBn,
      })),
    [cities],
  );

  const districtOptions: PickerOption[] = useMemo(
    () =>
      districts.map((district) => ({
        value: district.id.toString(),
        label: district.nameBn,
        sub: `${district.divisionBn} বিভাগ`,
        group: `${district.divisionBn} বিভাগ`,
      })),
    [districts],
  );

  const from = cities.find((city) => city.id.toString() === fromId);
  const to = districts.find((district) => district.id.toString() === toId);

  const km =
    from && to
      ? haversineKm(
          { lat: from.lat, lng: from.lng },
          { lat: to.lat, lng: to.lng },
        )
      : null;

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoError("এই ব্রাউজারে লোকেশন শেয়ার করা যাচ্ছে না। শহর বেছে নাও।");
      return;
    }
    setLocating(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let nearest = cities[0];
        let best = Number.POSITIVE_INFINITY;
        for (const city of cities) {
          const d = haversineKm(
            { lat: position.coords.latitude, lng: position.coords.longitude },
            { lat: city.lat, lng: city.lng },
          );
          if (d < best) {
            best = d;
            nearest = city;
          }
        }
        if (nearest) {
          setFromId(nearest.id.toString());
          setLocationNote(
            `তোমার কাছাকাছি শহর ${nearest.nameBn} ধরা হয়েছে। লোকেশন কোথাও জমা হয় না।`,
          );
        }
        setLocating(false);
      },
      () => {
        setLocating(false);
        setGeoError("লোকেশন পাওয়া যায়নি। শহর বেছে নাও।");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    );
  };

  return (
    <div className="route-card">
      <div className="route-line" aria-hidden="true" />

      <div className="place-row">
        <span className="place-pin from" aria-hidden="true">
          <MapPin size={18} />
        </span>
        <PlacePicker
          label="এখন থাকি"
          value={fromId}
          options={cityOptions}
          onChange={(value) => {
            setFromId(value);
            setLocationNote("");
            setGeoError("");
          }}
          placeholder="শহর বেছে নাও"
          searchPlaceholder="শহর বা দেশ খোঁজো…"
        />
        <button
          type="button"
          className="locate-btn"
          onClick={locate}
          disabled={locating}
          title="আমার বর্তমান লোকেশন দিয়ে কাছের শহর বেছে নাও"
        >
          <Crosshair size={14} className={locating ? "spin" : undefined} />
          {locating ? "খুঁজছি" : "আমার লোকেশন"}
        </button>
      </div>

      <div className="place-row">
        <span className="place-pin home" aria-hidden="true">
          <Home size={17} />
        </span>
        <PlacePicker
          label="বাড়ি"
          value={toId}
          options={districtOptions}
          onChange={(value) => setToId(value)}
          placeholder="জেলা বেছে নাও"
          searchPlaceholder="জেলা বা বিভাগ খোঁজো…"
        />
      </div>

      {geoError ? (
        <p className="geo-note" role="alert">
          {geoError}
        </p>
      ) : null}
      {locationNote ? <p className="geo-note">{locationNote}</p> : null}

      {km !== null && from && to ? (
        <div className="route-result">
          <p className="distance-caption">
            <span>{from.nameBn}</span>
            <ArrowRight size={13} aria-hidden="true" />
            <span className="mini-flag" aria-hidden="true" />
            <span>{to.nameBn}</span>
          </p>
          <p className="distance-number">
            {bn(Math.round(km))}
            <small>কিমি</small>
          </p>
          <p className="distance-caption" style={{ color: "var(--ink-3)" }}>
            সরলরেখায় আনুমানিক দূরত্ব
          </p>
          <div
            className="distance-caption"
            style={{ gap: 8, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}
          >
            <span className="chip">
              <Clock3 size={12} /> {from.nameBn} · {timeAt(from.lng)}
            </span>
            <span className="chip gold">
              <Clock3 size={12} /> {to.nameBn} · {timeAt(to.lng)}
            </span>
          </div>
          <div
            className="distance-caption"
            style={{ marginTop: 10, justifyContent: "center" }}
          >
            <Link href="/join" className="btn btn-red btn-sm">
              মানচিত্রে যোগ দাও <ArrowRight size={14} />
            </Link>
          </div>
          <p className="distance-note" style={{ marginTop: 4 }}>
            <ShieldCheck
              size={12}
              style={{ display: "inline", verticalAlign: -2, marginRight: 3 }}
            />
            কোনো লোকেশন জমা রাখা হয় না · সাইন-আপ ছাড়াও ব্যবহার করা যায়
          </p>
        </div>
      ) : (
        <div className="route-result" data-empty="true">
          দুটো জায়গা বেছে নাও — দূরত্বটা এখানেই দেখাব।
        </div>
      )}
    </div>
  );
}
