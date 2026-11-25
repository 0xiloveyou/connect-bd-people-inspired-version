import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  MapPin,
  Quote,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import { BangladeshMap } from "@/components/BangladeshMap";
import { DistrictQuiz } from "@/components/DistrictQuiz";
import { MemberGrid } from "@/components/MemberCard";
import { PhotoArt } from "@/components/PhotoArt";
import {
  getAllDistricts,
  getDistrictBySlug,
  getDistrictBySlugForMeta,
  getQuizForDistrict,
} from "@/lib/queries";
import { bn } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const district = await getDistrictBySlugForMeta(slug);
  if (!district) return { title: "জেলা পাওয়া যায়নি" };
  return {
    title: `${district.nameBn} জেলা`,
    description: `${district.nameBn} — ${district.taglineBn}। ${district.divisionBn} বিভাগের এই জেলার প্রবাসীদের ঠিকানা ও গল্প।`,
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const district = await getDistrictBySlug(slug);
  if (!district) notFound();

  const [allDistricts, quiz] = await Promise.all([
    getAllDistricts(),
    getQuizForDistrict(district.id),
  ]);

  const highlights = district.highlights
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  const cityMap = new Map<string, { nameBn: string; countryBn: string; count: number }>();
  const countrySet = new Set<string>();
  let yearsTotal = 0;
  for (const member of district.users) {
    if (member.city) {
      countrySet.add(member.city.countryCode);
      const key = `${member.city.nameBn}|${member.city.countryBn}`;
      const existing = cityMap.get(key);
      if (existing) existing.count += 1;
      else
        cityMap.set(key, {
          nameBn: member.city.nameBn,
          countryBn: member.city.countryBn,
          count: 1,
        });
    }
    yearsTotal += member.yearsAbroad;
  }
  const topCities = Array.from(cityMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const avgYears = district.users.length
    ? Math.round(yearsTotal / district.users.length)
    : 0;
  const photo = district.photos[0] ?? null;

  const members = district.users.slice(0, 12).map((member) => ({
    id: member.id,
    name: member.name,
    avatarColor: member.avatarColor,
    photoUrl: member.photoUrl,
    yearsAbroad: member.yearsAbroad,
    city: member.city
      ? {
          nameBn: member.city.nameBn,
          countryBn: member.city.countryBn,
          lat: member.city.lat,
          lng: member.city.lng,
        }
      : null,
    district: {
      nameBn: district.nameBn,
      slug: district.slug,
      lat: district.lat,
      lng: district.lng,
    },
  }));

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" style={{ marginBottom: 18 }}>
            <Link href="/districts">৬৪ জেলা</Link>
            <span aria-hidden="true">/</span>
            <span>{district.divisionBn} বিভাগ</span>
            <span aria-hidden="true">/</span>
            <span style={{ color: "var(--gold)" }}>{district.nameBn}</span>
          </div>

          <div className="district-hero-grid">
            <div className="district-hero-copy">
              <span className="eyebrow">জেলার ঠিকানা</span>
              <h1>
                {district.nameBn}
                <br />
                <span>থেকে প্রবাসে</span>
              </h1>
              <p>{district.taglineBn}। এই জেলার মানুষ আজ পৃথিবীর নানা প্রান্তে — কেউ কাজে, কেউ পড়াশোনায়, কেউ নতুন জীবন গড়তে।</p>

              <div className="district-badges">
                <span className="badge badge-gold">
                  <MapPin size={12} /> {district.divisionBn} বিভাগ
                </span>
                <span className="badge badge-live">
                  <span className="live-dot" aria-hidden="true" />
                  {bn(district.users.length)} জন প্রবাসী
                </span>
                <span className="badge">
                  <Globe2 size={12} /> {bn(countrySet.size)} দেশে
                </span>
              </div>

              <div className="btn-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 2 }}>
                <Link href="/map" className="btn btn-red">
                  মানচিত্রে দেখো <ArrowRight size={15} />
                </Link>
                <Link href="/join" className="btn btn-ghost">
                  <Users size={15} /> এই জেলার হয়ে যোগ দাও
                </Link>
              </div>
            </div>

            <div className="bd-map-frame">
              <BangladeshMap districts={allDistricts} activeSlug={district.slug} />
              <div className="bd-map-caption">
                <span>বাংলাদেশের মানচিত্রে জেলাটি</span>
                <b>{district.nameBn}</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="district-body">
        <div className="container district-layout">
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <article className="story-card">
              <span className="eyebrow">জেলার গল্প</span>
              <h2 className="h3">
                {district.nameBn}কে চেনো? <span style={{ color: "var(--green-700)" }}>শিকড় থেকে জানো।</span>
              </h2>

              <p className="story-text">{district.storyBn}</p>

              {highlights.length > 0 ? (
                <div className="chip-row">
                  {highlights.map((highlight) => (
                    <span className="chip" key={highlight}>
                      <Sparkles size={11} /> {highlight}
                    </span>
                  ))}
                </div>
              ) : null}

              <div
                className="glass"
                style={{
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  color: "var(--on-dark-2)",
                  fontSize: 13,
                  lineHeight: 1.65,
                }}
              >
                <Quote size={16} style={{ flex: "none", color: "var(--gold)", marginTop: 2 }} />
                <span>
                  প্রবাসে {district.nameBn} জেলার মানুষ যখন একসঙ্গে বসে, তখন শহরের নাম ভুলে
                  যায় — মনে পড়ে বাড়ির উঠান, আমগাছ আর ঈদের সকাল।
                </span>
              </div>

              <p className="story-en">{district.story}</p>
            </article>

            <DistrictQuiz
              districtId={district.id}
              districtName={district.nameBn}
              questions={quiz}
            />
          </div>

          <aside className="district-side">
            <div className="side-card">
              <h3>এক নজরে</h3>
              <div className="stat-line">
                <span>এই জেলার প্রবাসী</span>
                <b className="green">{bn(district.users.length)} জন</b>
              </div>
              <div className="stat-line">
                <span>শহরে ছড়িয়ে</span>
                <b>{bn(cityMap.size)} শহরে</b>
              </div>
              <div className="stat-line">
                <span>দেশে</span>
                <b>{bn(countrySet.size)} দেশে</b>
              </div>
              <div className="stat-line">
                <span>গড় প্রবাসকাল</span>
                <b className="red">{bn(avgYears)} বছর</b>
              </div>
              <div className="stat-line">
                <span>বিভাগ</span>
                <b>{district.divisionBn}</b>
              </div>
            </div>

            <div className="side-card">
              <h3>কোথায় আছেন</h3>
              {topCities.length === 0 ? (
                <p className="muted">
                  এখনো এই জেলার কেউ মানচিত্রে যোগ দেননি।{" "}
                  <Link href="/join" style={{ color: "var(--green-700)", fontWeight: 600 }}>
                    তুমিই প্রথম হও →
                  </Link>
                </p>
              ) : (
                <div className="side-city-list">
                  {topCities.map((city) => (
                    <div className="side-city-row" key={`${city.nameBn}-${city.countryBn}`}>
                      <span>
                        {city.nameBn}
                        <span style={{ color: "var(--ink-4)" }}> · {city.countryBn}</span>
                      </span>
                      <b>{bn(city.count)} জন</b>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/map" className="section-link" style={{ fontSize: 13 }}>
                পুরো মানচিত্র দেখো <ArrowRight size={13} />
              </Link>
            </div>

            {photo ? (
              <div className="side-card">
                <h3>জেলার ছবি</h3>
                <div
                  className="photo-card"
                  style={{
                    borderRadius: 12,
                    aspectRatio: "4 / 3",
                    border: "1px solid var(--line)",
                  }}
                >
                  <PhotoArt art={photo.art} uid={district.slug} />
                </div>
                <div>
                  <b style={{ fontSize: 14 }}>{photo.titleBn}</b>
                  <p className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                    {photo.credit}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="side-card">
              <h3>
                <CalendarDays
                  size={16}
                  style={{ display: "inline", verticalAlign: -2, marginRight: 5 }}
                />
                শেয়ার করো
              </h3>
              <p className="muted">
                {district.nameBn} জেলার গল্প বন্ধুদের সঙ্গে শেয়ার করো — হয়তো
                তোমার শহরেই কেউ এই জেলার।
              </p>
              <Link href="/join" className="btn btn-outline btn-block">
                <Share2 size={15} /> মানচিত্রে যোগ দাও
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="district-member-section">
        <div className="container">
          <div className="district-member-head">
            <div>
              <span className="eyebrow">একই শিকড়</span>
              <h2 className="h2">
                প্রবাসে {district.nameBn} জেলার মানুষ
              </h2>
              <p className="lead" style={{ marginTop: 8 }}>
                {bn(district.users.length)} জন প্রবাসী এই জেলার। তাঁদের গল্প, শহর
                আর শেয়ার কার্ড দেখো।
              </p>
            </div>
            <Link href="/map" className="section-link">
              মানচিত্রে সবাই <ArrowRight size={15} />
            </Link>
          </div>

          {members.length > 0 ? (
            <MemberGrid members={members} />
          ) : (
            <div className="empty-state">
              <b>এখনো কেউ নেই</b>
              {district.nameBn} জেলার প্রথম প্রবাসী হয়ে মানচিত্রে নাম লেখো।
              <div style={{ marginTop: 16 }}>
                <Link href="/join" className="btn btn-red">
                  যোগ দাও <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
