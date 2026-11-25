import type { Metadata } from "next";
import { Compass, Globe2, MapPin } from "lucide-react";
import { MapExplorer } from "@/components/MapExplorer";
import { getStats } from "@/lib/queries";
import { bn } from "@/lib/format";
import { getWorldGeo } from "@/lib/world";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "প্রবাসীদের মানচিত্র",
  description:
    "বিশ্ব মানচিত্রে বাংলাদেশের প্রবাসীরা। শহর, দেশ আর অঞ্চল অনুযায়ী খোঁজো — দেখো তোমার শহরে কতজন বাংলাদেশি আছেন।",
};

export default async function MapPage() {
  const stats = await getStats();
  const geo = getWorldGeo();

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">মানচিত্রে প্রবাসীরা</span>
          <h1>
            সারা পৃথিবীতে
            <br />
            <span>আমাদের ঠিকানা</span>
          </h1>
          <p className="lead">
            প্রতিটি পিন একটা শহর, প্রতিটি শহরে একটা করে গল্প। অঞ্চল বেছে নাও,
            শহরে ক্লিক করো — দেখো সেখানে কতজন বাংলাদেশি থাকেন, আর তাঁরা কোন
            জেলা থেকে এসেছেন।
          </p>

          <div className="page-hero-stats">
            <span className="page-stat">
              <b>{bn(stats.total)}</b> জন প্রবাসী
            </span>
            <span className="page-stat">
              <b>{bn(stats.cityCount)}</b> শহরে
            </span>
            <span className="page-stat">
              <b>{bn(stats.countryCount)}</b> দেশে
            </span>
            <span className="page-stat">
              <b>{bn(stats.districtCount)}</b> জেলা থেকে
            </span>
          </div>
        </div>
      </section>

      <section className="map-page">
        <div className="container">
          <div
            className="map-toolbar"
            style={{ marginBottom: 18, color: "var(--on-dark-2)" }}
          >
            <span className="badge badge-gold">
              <Globe2 size={13} /> লাইভ প্রবাসী মানচিত্র
            </span>
            <span className="map-note" style={{ marginTop: 0 }}>
              <MapPin size={13} /> পিনে ক্লিক করো · স্ক্রল করে জুম করো
            </span>
          </div>

          <MapExplorer
            cities={stats.cities}
            geo={geo}
            totals={{
              total: stats.total,
              cityCount: stats.cityCount,
              countryCount: stats.countryCount,
              districtCount: stats.districtCount,
            }}
          />

          <div
            className="map-note"
            style={{
              justifyContent: "space-between",
              borderTop: "1px solid var(--divider-dark)",
              paddingTop: 14,
              marginTop: 18,
            }}
          >
            <span>
              <Compass size={13} /> এখনো মানচিত্রে নেই?{" "}
              <a href="/join" style={{ color: "var(--gold)", fontWeight: 600 }}>
                নিজের শহর যোগ করো →
              </a>
            </span>
            <span>Natural Earth · Probashé map</span>
          </div>
        </div>
      </section>
    </>
  );
}
