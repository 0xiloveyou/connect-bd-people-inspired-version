import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Quote, ShieldCheck, Sparkles } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";
import {
  getCityOptions,
  getDistrictOptions,
  getStats,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { bn } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "যোগ দাও",
  description:
    "এক মিনিটে প্রবাসে মানচিত্রে যোগ দাও। শহর আর বাড়ির জেলা বেছে নাও, প্রবাসী বন্ধুদের সঙ্গে যুক্ত হও।",
};

const errorMessages: Record<string, string> = {
  "google-unavailable":
    "Google সাইন-ইন এখনো কনফিগার করা হয়নি। ইমেইল দিয়ে চালিয়ে যাও।",
  "oauth-state": "সাইন-ইনের সময়সীমা শেষ হয়ে গেছে। আবার চেষ্টা করো।",
  "oauth-failed": "Google সাইন-ইন সম্পন্ন হয়নি। আবার চেষ্টা করো।",
  "oauth-email": "Google অ্যাকাউন্ট থেকে ইমেইল পাওয়া যায়নি।",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(user.cityId ? "/profile" : "/onboarding");

  const [stats, cities, districts] = await Promise.all([
    getStats(),
    getCityOptions(),
    getDistrictOptions(),
  ]);

  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  const initialError = params.error ? errorMessages[params.error] ?? "" : "";

  return (
    <div className="auth-shell">
      <aside className="auth-side">
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span className="badge badge-gold" style={{ alignSelf: "flex-start" }}>
            <Sparkles size={13} /> প্রবাসীদের মানচিত্র
          </span>
          <h1>
            যেখানেই থাকো,
            <br />
            তোমার ঠিকানা থাকুক
            <br />
            <span>দেশের মানচিত্রে</span>
          </h1>
          <p>
            সৌদি আরব থেকে কানাডা, মালয়েশিয়া থেকে ইতালি — বাংলাদেশের প্রবাসীরা
            এখন এক মানচিত্রে। নিজের জায়গা যোগ করো, বাড়ির জেলার মানুষের খোঁজ নাও।
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="auth-side-stats">
            <div className="auth-side-stat">
              <b>{bn(stats.total)}</b>
              <span>জন প্রবাসী</span>
            </div>
            <div className="auth-side-stat">
              <b>{bn(stats.cityCount)}</b>
              <span>শহরে</span>
            </div>
            <div className="auth-side-stat">
              <b>{bn(stats.countryCount)}</b>
              <span>দেশে</span>
            </div>
            <div className="auth-side-stat">
              <b>{bn(stats.districtCount)}</b>
              <span>জেলা থেকে</span>
            </div>
          </div>

          <div
            className="glass"
            style={{
              borderRadius: 16,
              padding: "14px 16px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              color: "var(--on-dark-2)",
              fontSize: 13,
              lineHeight: 1.6,
              maxWidth: 430,
            }}
          >
            <Quote size={16} style={{ flex: "none", color: "var(--gold)", marginTop: 2 }} />
            <span>
              &ldquo;দেশ ছেড়ে এসেছি, দেশকে ছাড়িনি। এই মানচিত্রে নিজের জেলার
              মানুষ দেখলে মনে হয়, একটু কম দূরে আছি।&rdquo;
            </span>
          </div>

          <p
            style={{
              color: "var(--on-dark-3)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <ShieldCheck size={13} /> তথ্য নিরাপদ · কখনো কারও সঙ্গে শেয়ার করা হয় না
          </p>
        </div>
      </aside>

      <div className="auth-main">
        <div className="auth-main-inner">
          <AuthForm
            cities={cities}
            districts={districts}
            googleEnabled={googleEnabled}
            initialMode={params.mode === "login" ? "login" : "register"}
            initialError={initialError}
          />
          {!googleEnabled ? (
            <p
              className="muted"
              style={{ textAlign: "center", marginTop: 14, fontSize: 12 }}
            >
              Google সাইন-ইন চালু করতে <code>.env</code>-এ GOOGLE_CLIENT_ID ও
              GOOGLE_CLIENT_SECRET দাও।
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
