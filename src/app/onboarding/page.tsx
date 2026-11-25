import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MapPin, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getCityOptions, getDistrictOptions } from "@/lib/queries";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "প্রোফাইল সম্পূর্ণ করো",
};

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/join?mode=login");
  if (user.cityId && user.districtId) redirect("/profile");

  const [cities, districts] = await Promise.all([
    getCityOptions(),
    getDistrictOptions(),
  ]);

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="badge badge-gold" style={{ alignSelf: "flex-start" }}>
            <Sparkles size={13} /> শেষ একটা ধাপ
          </span>
          <h1>
            তোমার জায়গাটা <span>মানচিত্রে বসাই</span>
          </h1>
          <p className="lead">
            স্বাগতম, {user.name}! এখন শুধু বলো — প্রবাসে কোথায় থাকো, আর বাড়ি
            কোথায়। ব্যস, তোমার নাম মানচিত্রে জ্বলে উঠবে।
          </p>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="form-card">
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className="feature-icon" aria-hidden="true">
                <MapPin size={20} />
              </span>
              <div>
                <h2 className="form-title" style={{ fontSize: 23 }}>
                  শহর আর বাড়ি
                </h2>
                <p className="form-sub">
                  এই তথ্য দিয়ে তোমার দূরত্ব, জেলার তালিকা আর র‍্যাংকিং তৈরি হবে।
                </p>
              </div>
            </div>
            <ProfileForm
              cities={cities}
              districts={districts}
              redirectOnSave="/profile"
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
      </section>
    </>
  );
}
