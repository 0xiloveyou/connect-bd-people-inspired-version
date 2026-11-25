"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Search, Users } from "lucide-react";
import { bn } from "@/lib/format";
import type { DistrictWithCount } from "@/lib/queries";

const divisions = [
  "সব",
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ",
];

export function DistrictsBrowser({ districts }: { districts: DistrictWithCount[] }) {
  const [division, setDivision] = useState("সব");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return districts.filter((district) => {
      if (division !== "সব" && district.divisionBn !== division) return false;
      if (!q) return true;
      return [district.name, district.nameBn, district.division, district.divisionBn, district.taglineBn]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [districts, division, query]);

  const withMembers = filtered.filter((district) => district.count > 0).length;

  return (
    <>
      <div className="district-toolbar">
        <label className="district-search-wrap">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">জেলা খোঁজো</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="জেলার নাম বা বৈশিষ্ট্য দিয়ে খোঁজো…"
          />
        </label>

        <div className="division-chips" role="group" aria-label="বিভাগ অনুযায়ী ছাঁকো">
          {divisions.map((item) => (
            <button
              key={item}
              type="button"
              className="division-chip"
              data-active={division === item}
              onClick={() => setDivision(item)}
            >
              {item === "সব" ? "সব বিভাগ" : item}
            </button>
          ))}
        </div>

        <p className="muted" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={14} />
          {bn(filtered.length)} জেলা দেখা হচ্ছে · {bn(withMembers)} জেলায় প্রবাসী আছেন
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="districts-empty">
          <b>কোনো জেলা পাওয়া যায়নি</b>
          <p>অন্য নাম বা বিভাগ দিয়ে আবার খোঁজো।</p>
        </div>
      ) : (
        <div className="district-grid">
          {filtered.map((district) => (
            <Link
              key={district.id}
              href={`/districts/${district.slug}`}
              className="district-tile"
            >
              <div className="district-tile-top">
                <h3>{district.nameBn}</h3>
                <span>{bn(district.count)}</span>
              </div>
              <p>{district.taglineBn}</p>
              <div className="district-tile-meta">
                <span>
                  <MapPin
                    size={11}
                    style={{ display: "inline", verticalAlign: -1, marginRight: 3 }}
                  />
                  {district.divisionBn} বিভাগ
                </span>
                <b>{district.count > 0 ? `${bn(district.count)} জন` : "নতুন জেলা"}</b>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
