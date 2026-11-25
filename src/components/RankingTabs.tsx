"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { bn } from "@/lib/format";
import type { DistrictWithCount, MapCity } from "@/lib/queries";

type CountryRow = {
  code: string;
  name: string;
  nameBn: string;
  count: number;
  cities: number;
};

type TabId = "cities" | "districts" | "countries";

type RankItem = {
  key: string;
  name: string;
  sub?: string;
  count: number;
  href?: string;
};

const tabs: Array<{ id: TabId; label: string; title: string; sub: string }> = [
  {
    id: "cities",
    label: "শহর",
    title: "শহর অনুযায়ী",
    sub: "কোন শহরে সবচেয়ে বেশি প্রবাসী",
  },
  {
    id: "districts",
    label: "জেলা",
    title: "জেলা অনুযায়ী",
    sub: "প্রবাসে সবচেয়ে বেশি মানুষ কোন জেলা থেকে",
  },
  {
    id: "countries",
    label: "দেশ",
    title: "দেশ অনুযায়ী",
    sub: "কোন দেশে বাংলাদেশি প্রবাসী বেশি",
  },
];

const PAGE = 12;

export function RankingTabs({
  cities,
  districts,
  countries,
  total,
}: {
  cities: MapCity[];
  districts: DistrictWithCount[];
  countries: CountryRow[];
  total: number;
}) {
  const [tab, setTab] = useState<TabId>("cities");
  const [visible, setVisible] = useState(PAGE);

  const items: RankItem[] =
    tab === "cities"
      ? cities.map((city) => ({
          key: `city-${city.id}`,
          name: city.nameBn,
          sub: city.countryBn,
          count: city.count,
        }))
      : tab === "districts"
        ? districts.map((district) => ({
            key: `district-${district.id}`,
            name: district.nameBn,
            sub: `${district.divisionBn} বিভাগ`,
            count: district.count,
            href: `/districts/${district.slug}`,
          }))
        : countries.map((country) => ({
            key: `country-${country.code}`,
            name: country.nameBn,
            sub: `${bn(country.cities)} শহরে`,
            count: country.count,
          }));

  const current = tabs.find((item) => item.id === tab) ?? tabs[0];
  const max = items[0]?.count ?? 1;
  const shown = items.slice(0, visible);

  return (
    <>
      <div className="rank-tabs" role="tablist" aria-label="র‍্যাংকিং">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className="rank-tab"
            data-active={tab === item.id}
            onClick={() => {
              setTab(item.id);
              setVisible(PAGE);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rank-grid">
        <div className="rank-panel" style={{ gridColumn: "1 / -1" }}>
          <div className="rank-panel-head">
            <div>
              <h2>{current.title}</h2>
              <span>{current.sub}</span>
            </div>
            <span>মোট {bn(total)} জন প্রবাসী</span>
          </div>

          {items.length === 0 ? (
            <p className="rank-empty">এখনো কোনো তথ্য নেই।</p>
          ) : (
            <>
              <ol className="rank-list">
                {shown.map((item, index) => (
                  <li className="rank-row" key={item.key}>
                    <span className="rank-number">{bn(index + 1)}</span>
                    <span className="rank-name">
                      {item.href ? (
                        <Link href={item.href}>{item.name}</Link>
                      ) : (
                        <b>{item.name}</b>
                      )}
                      {item.sub ? <small>{item.sub}</small> : null}
                    </span>
                    <span className="rank-value">{bn(item.count)} জন</span>
                    <span className="bar-track">
                      <span
                        className="bar-fill"
                        style={{
                          width: `${Math.max(4, (item.count / max) * 100)}%`,
                        }}
                      />
                    </span>
                  </li>
                ))}
              </ol>

              {items.length > visible ? (
                <div className="rank-show-more">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setVisible((value) => value + PAGE)}
                  >
                    আরও দেখো <ChevronDown size={15} />
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <p className="muted" style={{ marginTop: 16 }}>
        তালিকা পাবলিক প্রোফাইলের ভিত্তিতে তৈরি।{" "}
        <Link href="/join" className="section-link" style={{ fontSize: 14 }}>
          তুমিও যোগ দাও <ArrowRight size={14} />
        </Link>
      </p>
    </>
  );
}
