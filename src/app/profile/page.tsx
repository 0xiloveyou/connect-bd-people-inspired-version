import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Share2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import {
  getAllDistricts,
  getCityOptions,
  getDistrictOptions,
  getMapCities,
} from "@/lib/queries";
import { bn, bnDate, formatKm, initials } from "@/lib/format";
import { haversineKm } from "@/lib/distance";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "আমার প্রোফাইল",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/join?mode=login");
  if (!user.cityId || !user.districtId) redirect("/onboarding");

  const [cities, districts, mapCities, allDistricts] = await Promise.all([
    getCityOptions(),
    getDistrictOptions(),
    getMapCities(),
    getAllDistricts(),
  ]);

  const cityCount = mapCities.find((city) => city.id === user.cityId)?.count ?? 0;
  const districtCount =
    allDistricts.find((district) => district.id === user.districtId)?.count ?? 0;

  const distance =
    user.city && user.district
      ? Math.round(
          haversineKm(
            { lat: user.city.lat, lng: user.city.lng },
            { lat: user.district.lat, lng: user.district.lng },
          ),
        )
      : null;

  return (
    <>
      <section className="profile-hero">
        <div className="container profile-hero-inner">
          <span
            className="profile-avatar"
            style={{
              background: `linear-gradient(145deg, ${user.avatarColor} 0%, #04140f 150%)`,
            }}
            aria-hidden="true"
          >
            {user.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoUrl}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 30,
                }}
              />
            ) : (
              initials(user.name)
            )}
          </span>

          <div className="profile-headline">
            <span className="eyebrow">আমার প্রোফাইল</span>
            <h1>{user.name}</h1>
            <div className="profile-meta">
              {user.profession ? (
                <>
                  <span>{user.profession}</span>
                  <span className="dot" />
                </>
              ) : null}
              <span>
                <MapPin size={13} style={{ display: "inline", verticalAlign: -2 }} />{" "}
                {user.city ? `${user.city.nameBn}, ${user.city.countryBn}` : "শহর নেই"}
              </span>
              <span className="dot" />
              <span>বাড়ি {user.district?.nameBn}</span>
              <span className="dot" />
              <span>
                <CalendarDays
                  size={13}
                  style={{ display: "inline", verticalAlign: -2 }}
                />{" "}
                যোগ দিয়েছ {bnDate(user.createdAt)}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <Link href={`/card/${user.id}`} className="btn btn-red">
              <Share2 size={15} /> শেয়ার কার্ড
            </Link>
            <Link href="/map" className="btn btn-ghost">
              মানচিত্রে দেখো
            </Link>
          </div>
        </div>
      </section>

      <section className="profile-body">
        <div className="container profile-grid">
          <div>
            <div className="profile-stats" style={{ marginBottom: 16 }}>
              <div className="profile-stat">
                <b>{distance !== null ? formatKm(distance) : "—"}</b>
                <span>বাড়ি থেকে দূরত্ব</span>
              </div>
              <div className="profile-stat">
                <b>{bn(cityCount)}</b>
                <span>{user.city?.nameBn} শহরে প্রবাসী</span>
              </div>
              <div className="profile-stat">
                <b>{bn(districtCount)}</b>
                <span>{user.district?.nameBn} জেলার প্রবাসী</span>
              </div>
            </div>

            <div className="form-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 4,
                }}
              >
                <span className="feature-icon" aria-hidden="true">
                  <UserRound size={20} />
                </span>
                <div>
                  <h2 className="form-title" style={{ fontSize: 22 }}>
                    প্রোফাইল সম্পাদনা
                  </h2>
                  <p className="form-sub">
                    শহর, জেলা বা পেশা বদলালে মানচিত্রেও বদলে যাবে।
                  </p>
                </div>
              </div>

              <ProfileForm
                cities={cities}
                districts={districts}
                cardHref={`/card/${user.id}`}
                initial={{
                  name: user.name,
                  cityId: user.cityId?.toString() ?? "",
                  districtId: user.districtId?.toString() ?? "",
                  yearsAbroad: user.yearsAbroad.toString(),
                  profession: user.profession ?? "",
                  bio: user.bio ?? "",
                  photoUrl: user.photoUrl ?? "",
                  isPublic: user.isPublic,
                }}
              />
            </div>
          </div>

          <aside className="district-side">
            <div className="side-card">
              <h3>
                <Sparkles
                  size={17}
                  style={{ display: "inline", verticalAlign: -2, color: "var(--red-600)" }}
                />{" "}
                তোমার শেয়ার কার্ড
              </h3>
              <p className="muted">
                তোমার নাম, শহর, বাড়ির জেলা আর দূরত্ব দিয়ে তৈরি একটা কার্ড —
                ডাউনলোড করে সোশ্যাল মিডিয়ায় শেয়ার করো।
              </p>
              <Link href={`/card/${user.id}`} className="btn btn-outline btn-block">
                কার্ড দেখো <ArrowRight size={15} />
              </Link>
            </div>

            <div className="side-card">
              <h3>
                <ShieldCheck
                  size={17}
                  style={{ display: "inline", verticalAlign: -2, color: "var(--green-700)" }}
                />{" "}
                গোপনীয়তা
              </h3>
              <p className="muted">
                তুমি চাইলে প্রোফাইলটি মানচিত্র থেকে লুকিয়ে রাখতে পারো। তোমার
                ইমেইল কখনো প্রকাশ্যে দেখানো হয় না।
              </p>
              <div className="chip-row">
                <span className="chip">{user.isPublic ? "পাবলিক" : "প্রাইভেট"}</span>
                <span className="chip gold">{bn(user.yearsAbroad)} বছর প্রবাসে</span>
              </div>
            </div>

            <div className="side-card">
              <h3>অন্য কোথাও যাও</h3>
              <Link href={`/districts/${user.district?.slug ?? ""}`} className="section-link">
                তোমার জেলার গল্প <ArrowRight size={14} />
              </Link>
              <Link href="/ranking" className="section-link">
                র‍্যাংকিং দেখো <ArrowRight size={14} />
              </Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="btn btn-outline btn-block">
                  সাইন আউট
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
