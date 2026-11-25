import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Camera,
  Globe2,
  HelpCircle,
  Languages,
  MapPin,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Utensils,
  Users,
} from "lucide-react";
import {
  distanceForMember,
  getAllDistricts,
  getCityOptions,
  getDistrictOptions,
  getLatestMembers,
  getPhotos,
  getStats,
  getTopDistricts,
} from "@/lib/queries";
import { bn } from "@/lib/format";
import { Globe } from "@/components/Globe";
import { LiveFeed, type FeedItem } from "@/components/LiveFeed";
import { MemberGrid } from "@/components/MemberCard";
import { DistanceChecker } from "@/components/DistanceChecker";
import { WorldMap } from "@/components/WorldMap";
import { RankingBoards } from "@/components/RankingBoards";
import { PhotoArt } from "@/components/PhotoArt";
import { SectionHead } from "@/components/SectionHead";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: Globe2,
    title: "মানচিত্রে তোমার জায়গা",
    desc: "শহর আর বাড়ির জেলা বেছে নাও — মানচিত্রে জ্বলে উঠুক তোমার নাম।",
  },
  {
    icon: BookOpen,
    title: "জেলার গল্প",
    desc: "৬৪ জেলার নিজস্ব গল্প, ঐতিহ্য আর প্রবাসীদের স্মৃতির ঠিকানা।",
  },
  {
    icon: HelpCircle,
    title: "জেলার কুইজ",
    desc: "নিজের জেলা কতটা চেনো? খেলে দেখো, স্কোর শেয়ার করো।",
  },
  {
    icon: Share2,
    title: "শেয়ার কার্ড",
    desc: "তোমার শহর, বাড়ি আর দূরত্ব দিয়ে তৈরি সুন্দর সোশ্যাল কার্ড।",
  },
  {
    icon: Trophy,
    title: "জেলা ও শহরের র‍্যাংকিং",
    desc: "কোন শহরে কত প্রবাসী, কোন জেলা এগিয়ে — লাইভ তালিকা।",
  },
  {
    icon: Camera,
    title: "আজকের জেলার ছবি",
    desc: "প্রতিদিন এক জেলার রূপ — প্রবাসীদের পাঠানো স্মৃতি থেকে।",
  },
];

const roadmap = [
  { icon: Users, title: "প্রবাসী মিটআপ", sub: "শহরে শহরে দেখা" },
  { icon: Utensils, title: "জেলার খাবার", sub: "রেসিপি ও রেস্টুরেন্ট" },
  { icon: Briefcase, title: "চাকরির খবর", sub: "প্রবাসীদের জন্য" },
  { icon: Languages, title: "ভাষা বিনিময়", sub: "শেখো ও শেখাও" },
];

export default async function HomePage() {
  const [stats, latest, photos, topDistricts, cityOptions, districtOptions] =
    await Promise.all([
      getStats(),
      getLatestMembers(12),
      getPhotos(5),
      getTopDistricts(6),
      getCityOptions(),
      getDistrictOptions(),
    ]);

  const feed: FeedItem[] = latest.slice(0, 6).map((member) => ({
    id: member.id,
    name: member.name,
    cityBn: member.city?.nameBn ?? "কোথাও",
    countryBn: member.city?.countryBn ?? "",
    districtBn: member.district?.nameBn ?? "",
    distanceKm: distanceForMember(member),
  }));

  const worldMarkers = stats.cities;
  const topCountries = stats.countries.slice(0, 8);
  const maxCountry = topCountries[0]?.count ?? 1;
  const districts = await getAllDistricts();
  const withMembers = districts.filter((district) => district.count > 0);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="badge badge-live">
              <span className="live-dot" aria-hidden="true" />
              <b style={{ fontWeight: 700 }}>{bn(stats.total)}</b> জন প্রবাসী এখন মানচিত্রে
            </span>

            <h1 className="hero-title">
              সারা পৃথিবী থেকে
              <br />
              <em>এক সুতোয়</em> দেশে
            </h1>

            <p className="hero-lead">
              যেখানেই থাকো, তোমার জায়গাটা দেশের মানচিত্রে এঁকে রাখো। শহর আর
              বাড়ির জেলার দূরত্ব, জেলার গল্প, আর প্রবাসী বন্ধুদের খোঁজ — সব এক
              জায়গায়।
            </p>

            <div className="hero-actions">
              <Link href="/join" className="btn btn-red btn-xl">
                মানচিত্রে যোগ দাও <ArrowRight size={17} />
              </Link>
              <Link href="/map" className="btn btn-ghost btn-xl">
                <MapPin size={16} /> মানচিত্র দেখো
              </Link>
            </div>

            <p className="on-dark-muted" style={{ fontSize: 13 }}>
              ইমেইলে, এক মিনিটে · সাইন-আপ ফ্রি · কোনো লোকেশন জমা হয় না
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <b>{bn(stats.total)}</b>
                <span>প্রবাসী</span>
              </div>
              <div className="hero-stat">
                <b>{bn(stats.countryCount)}</b>
                <span>দেশে</span>
              </div>
              <div className="hero-stat">
                <b>{bn(stats.cityCount)}</b>
                <span>শহরে</span>
              </div>
              <div className="hero-stat">
                <b className="gold">{bn(stats.districtCount)}</b>
                <span>জেলা থেকে</span>
              </div>
            </div>

            <LiveFeed items={feed} />
          </div>

          <div className="hero-visual">
            <Globe
              markers={worldMarkers.slice(0, 60).map((city) => ({
                nameBn: city.nameBn,
                lat: city.lat,
                lng: city.lng,
                count: city.count,
              }))}
              total={stats.total}
              countryCount={stats.countryCount}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Latest members */}
      <section className="section section-white">
        <div className="container">
          <SectionHead
            eyebrow="নতুন যোগ দেওয়া"
            title="সর্বশেষ যারা যুক্ত হয়েছেন"
            lead="প্রতিটি নামের পেছনে একটা করে দেশ, একটা করে বাড়ি আর অনেকগুলো মিসিং।"
            href="/map"
            linkLabel="সবাইকে দেখো"
          />
          <MemberGrid members={latest} />
        </div>
      </section>

      {/* ---------------------------------------------------------- Distance */}
      <section id="far" className="section section-cream distance-section">
        <div className="container">
          <div className="distance-shell">
            <div className="distance-copy">
              <span className="eyebrow">তুমি কত দূরে?</span>
              <h2 className="h2">
                দুটো জায়গা,
                <br />
                এক সুতো — দূরত্বটা কত?
              </h2>
              <p className="lead">
                কোথায় থাকো আর বাড়ি কোথায় — বেছে নাও। আমরা হিসাব করব তোমার
                দূরত্ব। সাইন-আপ লাগবে না, কোনো লোকেশনও জমা রাখি না।
              </p>

              <div className="privacy-note">
                <ShieldCheck size={16} aria-hidden="true" />
                <span>
                  হিসাবটা পুরোটাই তোমার ব্রাউজারে হয়। বাড়ি, শহর বা লোকেশন —
                  কিছুই সার্ভারে পাঠানো হয় না।
                </span>
              </div>

              <div className="chip-row">
                <span className="chip">
                  <Sparkles size={12} /> ৬৪ জেলা
                </span>
                <span className="chip">
                  <Globe2 size={12} /> {bn(stats.cityCount)} শহর
                </span>
                <span className="chip">
                  <Users size={12} /> {bn(stats.total)} প্রবাসী
                </span>
              </div>
            </div>

            <DistanceChecker cities={cityOptions} districts={districtOptions} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ World presence */}
      <section className="section section-dark">
        <div className="container">
          <SectionHead
            eyebrow="বাংলাদেশের মানুষ সারা পৃথিবীতে"
            title={
              <>
                এক দেশ, ছড়িয়ে আছে <span style={{ color: "var(--gold)" }}>চার মহাদেশে</span>
              </>
            }
            lead="রিয়াদ থেকে টরন্টো, সিডনি থেকে রোম — প্রতিটি বিন্দু একজন বাংলাদেশি। বিন্দুতে চাপ দিলে দেখতে পাবে কে, কোথায়।"
            href="/map"
            linkLabel="বড় মানচিত্রে দেখো"
          />

          <div className="page-hero-stats" style={{ marginBottom: 22 }}>
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

          <div className="presence-grid">
            <div className="map-card">
              <WorldMap cities={worldMarkers} showLabels />
              <span className="map-card-credit">
                Natural Earth · Probashé map
              </span>
            </div>

            <div className="presence-list">
              {topCountries.map((country, index) => (
                <div className="country-row" key={country.code}>
                  <span className="country-rank">{bn(index + 1)}</span>
                  <span className="country-name">
                    {country.nameBn}
                    <span
                      style={{
                        color: "var(--on-dark-3)",
                        fontSize: 11,
                        marginLeft: 6,
                      }}
                    >
                      {bn(country.cities)} শহর
                    </span>
                  </span>
                  <span className="country-count">{bn(country.count)}</span>
                  <span className="bar-track">
                    <span
                      className="bar-fill"
                      style={{
                        width: `${Math.max(5, (country.count / maxCountry) * 100)}%`,
                      }}
                    />
                  </span>
                </div>
              ))}
              <Link href="/map" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>
                সব শহর মানচিত্রে <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Ranking */}
      <section className="section section-green">
        <div className="container">
          <SectionHead
            eyebrow="লাইভ র‍্যাংকিং"
            title="কোথায় বেশি প্রবাসী?"
            lead="সৌদি আরবের শহরগুলো এখনো শীর্ষে, কিন্তু কানাডা, ইউরোপ আর অস্ট্রেলিয়াও এগিয়ে আসছে।"
            href="/ranking"
            linkLabel="পুরো র‍্যাংকিং"
          />
          <RankingBoards cities={stats.cities} districts={topDistricts} limit={6} />
          <p
            className="on-dark-muted"
            style={{ fontSize: 12, marginTop: 16, textAlign: "right" }}
          >
            সর্বমোট যোগ দেওয়া প্রবাসীর সংখ্যা অনুযায়ী · {bn(withMembers.length)} জেলায় সক্রিয়
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------- Photos */}
      <section className="section section-cream">
        <div className="container">
          <SectionHead
            eyebrow="আজকের জেলার ছবি"
            title="দেশের রূপ, প্রবাসীর চোখে"
            lead="প্রতিদিন একটা জেলা, একটা গল্প। ছবিতে চাপ দিয়ে জেলার মানুষ আর গল্পের কাছে যাও।"
            href="/districts"
            linkLabel="৬৪ জেলা দেখো"
          />

          <div className="photo-grid">
            {photos.filter((photo) => photo.district).map((photo) => (
              <Link
                key={photo.id}
                href={`/districts/${photo.district!.slug}`}
                className="photo-card"
              >
                <PhotoArt art={photo.art} uid={photo.district!.slug} />
                <span className="photo-caption">
                  <b>{photo.titleBn}</b>
                  <span>
                    {photo.district!.nameBn} · {photo.district!.divisionBn} বিভাগ
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="photo-meta">
            <span>সব ছবি প্রবাসে কমিউনিটির সৌজন্যে</span>
            <Link href="/idea">তোমার জেলার ছবি পাঠাও →</Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Features */}
      <section className="section section-white">
        <div className="container">
          <SectionHead
            eyebrow="প্রথম সংস্করণে যা থাকছে"
            title="শিকড়ের সঙ্গে থাকার সব উপায়"
            lead="মানচিত্র, গল্প, কুইজ, কার্ড আর র‍্যাংকিং — সব এক জায়গায়, বাংলায়।"
          />

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div className="feature-card" key={feature.title}>
                  <span className="feature-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <span className="feature-body">
                    <span className="feature-title">{feature.title}</span>
                    <span className="feature-desc">{feature.desc}</span>
                    <span className="feature-tag">
                      <span className="live-dot" aria-hidden="true" /> এখনই ব্যবহার করা যাচ্ছে
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="roadmap">
            {roadmap.map((item) => {
              const Icon = item.icon;
              return (
                <div className="roadmap-card" key={item.title}>
                  <Icon size={18} aria-hidden="true" />
                  <span>
                    {item.title}
                    <small>{item.sub}</small>
                  </span>
                </div>
              );
            })}
          </div>

          <Link href="/idea" className="idea-banner">
            <span className="idea-banner-icon" aria-hidden="true">
              <Sparkles size={22} />
            </span>
            <span className="idea-banner-body">
              <b>দেশে অ্যাপে কী চাও?</b>
              <span>যা চাও লিখে পাঠাও — টিম প্রতিটা আইডিয়া পড়ে।</span>
            </span>
            <ArrowRight size={20} style={{ color: "var(--red-600)", flex: "none" }} />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- Join CTA */}
      <section className="join-cta">
        <div className="container join-cta-inner">
          <span className="badge badge-gold">
            <span className="live-dot" aria-hidden="true" />
            {bn(stats.countryCount)} দেশে {bn(stats.total)} প্রবাসী
          </span>
          <h2>
            যেখানেই থাকো,
            <br />
            <span>মন পড়ে থাকে দেশে</span>
          </h2>
          <p>
            এক মিনিটে তোমার জায়গাটা মানচিত্রে যোগ করো। বাড়ির জেলা, প্রবাসের
            শহর — আর একটা সুতোয় সবার সঙ্গে যুক্ত হও।
          </p>
          <div className="btn-row">
            <Link href="/join" className="btn btn-red btn-xl">
              মানচিত্রে যোগ দাও <ArrowRight size={17} />
            </Link>
            <Link href="/#far" className="btn btn-ghost btn-xl">
              তুমি কত দূরে?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
