"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { PlacePicker, type PickerOption } from "./PlacePicker";
import type { DistanceCity, DistanceDistrict } from "./DistanceChecker";

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.86-6.86C35.93 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.14-3.09-.4-4.55H24v9.02h12.94c-.56 2.97-2.26 5.49-4.82 7.18l7.73 6c4.51-4.17 7.13-10.3 7.13-17.65Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.5 14.5 0 0 1 9.77 24c0-1.6.27-3.14.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.87.92 7.53 2.56 10.78l7.97-6.19Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

export function AuthForm({
  cities,
  districts,
  googleEnabled,
  initialMode = "register",
  initialError = "",
}: {
  cities: DistanceCity[];
  districts: DistanceDistrict[];
  googleEnabled: boolean;
  initialMode?: "login" | "register";
  initialError?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cityId, setCityId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [years, setYears] = useState("1");
  const [profession, setProfession] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const cityOptions: PickerOption[] = cities.map((city) => ({
    value: city.id.toString(),
    label: city.nameBn,
    sub: city.countryBn,
    group: city.countryBn,
  }));
  const districtOptions: PickerOption[] = districts.map((district) => ({
    value: district.id.toString(),
    label: district.nameBn,
    sub: `${district.divisionBn} বিভাগ`,
    group: `${district.divisionBn} বিভাগ`,
  }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (mode === "register") {
      if (name.trim().length < 2) {
        setError("তোমার নাম লিখো।");
        return;
      }
      if (!cityId) {
        setError("প্রবাসে কোন শহরে থাকো বেছে নাও।");
        return;
      }
      if (!districtId) {
        setError("বাড়ির জেলা বেছে নাও।");
        return;
      }
    }

    setBusy(true);
    try {
      const endpoint =
        mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "register"
          ? {
              name,
              email,
              password,
              cityId: Number(cityId),
              districtId: Number(districtId),
              yearsAbroad: Number(years) || 0,
              profession: profession || null,
              isPublic,
            }
          : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        redirect?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "কিছু একটা ভুল হয়েছে।");
        setBusy(false);
        return;
      }

      router.push(data.redirect ?? "/profile");
      router.refresh();
    } catch {
      setError("নেটওয়ার্কে সমস্যা হয়েছে। আবার চেষ্টা করো।");
      setBusy(false);
    }
  };

  return (
    <div className="form-card">
      <div className="tabs" role="tablist" aria-label="অ্যাকাউন্ট">
        <button
          type="button"
          className="tab"
          data-active={mode === "register"}
          onClick={() => {
            setMode("register");
            setError("");
          }}
          role="tab"
          aria-selected={mode === "register"}
        >
          নতুন অ্যাকাউন্ট
        </button>
        <button
          type="button"
          className="tab"
          data-active={mode === "login"}
          onClick={() => {
            setMode("login");
            setError("");
          }}
          role="tab"
          aria-selected={mode === "login"}
        >
          সাইন ইন
        </button>
      </div>

      <h1 className="form-title">
        {mode === "register" ? "মানচিত্রে তোমার জায়গা" : "আবার স্বাগতম"}
      </h1>
      <p className="form-sub">
        {mode === "register"
          ? "এক মিনিটের মধ্যেই তোমার শহর আর বাড়ির জেলা মানচিত্রে যুক্ত হবে।"
          : "তোমার ইমেইল আর পাসওয়ার্ড দিয়ে আবার ঢুকে পড়ো।"}
      </p>

      {googleEnabled ? (
        <>
          <div style={{ marginTop: 20 }}>
            <a href="/api/auth/google" className="google-btn">
              <GoogleIcon />
              Google দিয়ে চালিয়ে যাও
            </a>
          </div>
          <div className="divider-or" style={{ marginTop: 16 }}>
            অথবা ইমেইলে
          </div>
        </>
      ) : null}

      <form className="form" onSubmit={submit}>
        {error ? (
          <div className="form-error" role="alert">
            {error}
          </div>
        ) : null}

        {mode === "register" ? (
          <>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">
                  <UserRound
                    size={13}
                    style={{ display: "inline", verticalAlign: -2, marginRight: 4 }}
                  />
                  তোমার নাম
                </label>
                <input
                  id="name"
                  className="input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="profession">পেশা (ঐচ্ছিক)</label>
                <input
                  id="profession"
                  className="input"
                  value={profession}
                  onChange={(event) => setProfession(event.target.value)}
                  placeholder="যেমন: সফটওয়্যার ইঞ্জিনিয়ার"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="email">
                  <Mail
                    size={13}
                    style={{ display: "inline", verticalAlign: -2, marginRight: 4 }}
                  />
                  ইমেইল
                </label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tumi@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">
                  <LockKeyhole
                    size={13}
                    style={{ display: "inline", verticalAlign: -2, marginRight: 4 }}
                  />
                  পাসওয়ার্ড
                </label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="অন্তত ৬ অক্ষর"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <span className="field-label">এখন থাকি</span>
                <PlacePicker
                  label="প্রবাসের শহর"
                  value={cityId}
                  options={cityOptions}
                  onChange={setCityId}
                  placeholder="শহর বেছে নাও"
                  searchPlaceholder="শহর বা দেশ খোঁজো…"
                />
              </div>
              <div className="field">
                <span className="field-label">বাড়ি</span>
                <PlacePicker
                  label="বাড়ির জেলা"
                  value={districtId}
                  options={districtOptions}
                  onChange={setDistrictId}
                  placeholder="জেলা বেছে নাও"
                  searchPlaceholder="জেলা খোঁজো…"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="years">কত বছর প্রবাসে?</label>
                <input
                  id="years"
                  className="input"
                  type="number"
                  min={0}
                  max={70}
                  value={years}
                  onChange={(event) => setYears(event.target.value)}
                />
              </div>
              <div className="field" style={{ justifyContent: "flex-end" }}>
                <label className="checkbox-row" htmlFor="public">
                  <input
                    id="public"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(event) => setIsPublic(event.target.checked)}
                  />
                  <span>মানচিত্রে আমার নাম দেখানো যাবে</span>
                </label>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label htmlFor="login-email">
                <Mail
                  size={13}
                  style={{ display: "inline", verticalAlign: -2, marginRight: 4 }}
                />
                ইমেইল
              </label>
              <input
                id="login-email"
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tumi@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="login-password">
                <LockKeyhole
                  size={13}
                  style={{ display: "inline", verticalAlign: -2, marginRight: 4 }}
                />
                পাসওয়ার্ড
              </label>
              <input
                id="login-password"
                className="input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="তোমার পাসওয়ার্ড"
                autoComplete="current-password"
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-red btn-block" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={16} className="spin" /> একটু অপেক্ষা করো…
            </>
          ) : (
            <>
              {mode === "register" ? "অ্যাকাউন্ট খুলে যোগ দাও" : "সাইন ইন"}
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <p className="form-note">
          যোগ দেওয়ার মাধ্যমে তুমি আমাদের{" "}
          <Link href="/terms">শর্তাবলি</Link> ও{" "}
          <Link href="/privacy">গোপনীয়তা নীতি</Link> মেনে নিচ্ছো।
        </p>
      </form>

      {mode === "login" ? (
        <div className="demo-hint">
          <span>
            <b>ডেমো অ্যাকাউন্ট:</b> <code>demo@probash.app</code> ·{" "}
            <code>probash123</code>
          </span>
        </div>
      ) : (
        <div className="demo-hint">
          <span>
            শুধু দেখতে চাও? ডেমো অ্যাকাউন্ট: <code>demo@probash.app</code> ·{" "}
            <code>probash123</code>
          </span>
        </div>
      )}
    </div>
  );
}
