"use client";

import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { bn } from "@/lib/format";

export type FeedItem = {
  id: number;
  name: string;
  cityBn: string;
  countryBn: string;
  districtBn: string;
  distanceKm: number | null;
};

export function LiveFeed({ items }: { items: FeedItem[] }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (items.length <= 3) return;
    const id = window.setInterval(() => {
      setOffset((current) => (current + 1) % items.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [items.length]);

  const visible = items.length
    ? Array.from({ length: Math.min(3, items.length) }, (_, index) => {
        return items[(offset + index) % items.length];
      })
    : [];

  return (
    <div className="live-feed" aria-label="সর্বশেষ যোগ দেওয়া প্রবাসী">
      <p className="live-feed-head">
        <Radio size={12} aria-hidden="true" />
        <span>সর্বশেষ যোগ দিলেন</span>
        <span className="live-dot" style={{ marginLeft: "auto" }} aria-hidden="true" />
      </p>
      {visible.length === 0 ? (
        <p className="live-feed-row" style={{ color: "var(--on-dark-3)" }}>
          প্রথম মানুষটি হতে পারো তুমি।
        </p>
      ) : (
        visible.map((item) => (
          <p className="live-feed-row" key={`${offset}-${item.id}`}>
            <span>
              <span className="feed-name">{item.name}</span>{" "}
              <span className="feed-place">
                · {item.cityBn}
              </span>
            </span>
            <span className="feed-km">
              {item.distanceKm !== null ? `${bn(item.distanceKm)} কিমি` : "নতুন"}
            </span>
          </p>
        ))
      )}
    </div>
  );
}
