import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { RankingTabs } from "@/components/RankingTabs";
import { getAllDistricts, getStats } from "@/lib/queries";
import { bn } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "র‍্যাংকিং",
  description:
    "কোন শহর, জেলা বা দেশে বাংলাদেশি প্রবাসী সবচেয়ে বেশি? প্রবাসে বাংলাদেশের মানুষের র‍্যাংকিং দেখো।",
};

export default async function RankingPage() {
  const [stats, districts] = await Promise.all([getStats(), getAllDistricts()]);
  const withMembers = districts.filter((district) => district.count > 0);

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">প্রবাসের হিসাব</span>
          <h1>
            কে কোথায়
            <br />
            <span>সবচেয়ে বেশি?</span>
          </h1>
          <p className="lead">
            শহর, জেলা আর দেশ — তিনভাবে সাজানো প্রবাসী বাংলাদেশিদের তালিকা। দেখো
            তোমার শহর বা বাড়ির জেলা কত নম্বরে আছে, আর কতজনকে আপনি চেনেন।
          </p>

          <div className="page-hero-stats">
            <span className="page-stat">
              <Trophy
                size={14}
                style={{ display: "inline", verticalAlign: -2, marginRight: 6 }}
              />
              <b>{bn(stats.total)}</b> জন প্রবাসী
            </span>
            <span className="page-stat">
              <b>{bn(stats.cityCount)}</b> শহর
            </span>
            <span className="page-stat">
              <b>{bn(withMembers.length)}</b> জেলা
            </span>
            <span className="page-stat">
              <b>{bn(stats.countryCount)}</b> দেশ
            </span>
          </div>
        </div>
      </section>

      <section className="rank-section">
        <div className="container">
          <RankingTabs
            cities={stats.cities}
            districts={withMembers}
            countries={stats.countries}
            total={stats.total}
          />
        </div>
      </section>
    </>
  );
}
