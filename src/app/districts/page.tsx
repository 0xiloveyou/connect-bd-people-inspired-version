import type { Metadata } from "next";
import { MapPinned } from "lucide-react";
import { DistrictsBrowser } from "@/components/DistrictsBrowser";
import { getAllDistricts } from "@/lib/queries";
import { bn } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "৬৪ জেলা",
  description:
    "বাংলাদেশের ৬৪ জেলার গল্প, ঐতিহ্য আর প্রবাসীদের ঠিকানা। তোমার জেলা খোঁজো, মানচিত্রে দেখো কতজন প্রবাসে আছেন।",
};

export default async function DistrictsPage() {
  const districts = await getAllDistricts();
  const withMembers = districts.filter((district) => district.count > 0);
  const totalMembers = districts.reduce((sum, district) => sum + district.count, 0);
  const top = districts[0];

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">শিকড়ের ঠিকানা</span>
          <h1>
            ছেষট্টি জেলা,
            <br />
            <span>একটাই দেশ</span>
          </h1>
          <p className="lead">
            পদ্মার চর থেকে সিলেটের চা-বাগান, সুন্দরবন থেকে পাহাড়ের ভাঁজ — প্রতিটি
            জেলার নিজের গল্প আছে। জেলা বেছে নাও, দেখো প্রবাসে সেই জেলার মানুষ
            কোথায় কোথায় ছড়িয়ে আছেন।
          </p>

          <div className="page-hero-stats">
            <span className="page-stat">
              <MapPinned
                size={14}
                style={{ display: "inline", verticalAlign: -2, marginRight: 6 }}
              />
              <b>{bn(districts.length)}</b> জেলা
            </span>
            <span className="page-stat">
              <b>{bn(withMembers.length)}</b> জেলায় প্রবাসী
            </span>
            <span className="page-stat">
              <b>{bn(totalMembers)}</b> জন প্রবাসী
            </span>
            {top ? (
              <span className="page-stat">
                সবচেয়ে বেশি <b>{top.nameBn}</b>
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="district-section">
        <div className="container">
          <DistrictsBrowser districts={districts} />
        </div>
      </section>
    </>
  );
}
