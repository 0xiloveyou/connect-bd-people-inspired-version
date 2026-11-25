"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Save } from "lucide-react";
import { PlacePicker, type PickerOption } from "./PlacePicker";
import type { DistanceCity, DistanceDistrict } from "./DistanceChecker";

export type ProfileFormValues = {
  name: string;
  cityId: string;
  districtId: string;
  yearsAbroad: string;
  profession: string;
  bio: string;
  photoUrl: string;
  isPublic: boolean;
};

export function ProfileForm({
  cities,
  districts,
  initial,
  redirectOnSave,
  cardHref,
  compact = false,
}: {
  cities: DistanceCity[];
  districts: DistanceDistrict[];
  initial: ProfileFormValues;
  redirectOnSave?: string;
  cardHref?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

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

  const update = <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (values.name.trim().length < 2) {
      setError("তোমার নাম লিখো।");
      return;
    }
    if (!values.cityId || !values.districtId) {
      setError("শহর আর বাড়ির জেলা বেছে নাও।");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          cityId: Number(values.cityId),
          districtId: Number(values.districtId),
          yearsAbroad: Number(values.yearsAbroad) || 0,
          profession: values.profession || null,
          bio: values.bio || null,
          photoUrl: values.photoUrl || null,
          isPublic: values.isPublic,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok) {
        setError(data.error ?? "সংরক্ষণ করা যায়নি।");
        setBusy(false);
        return;
      }
      setSuccess("প্রোফাইল সংরক্ষণ হয়েছে।");
      setBusy(false);
      if (redirectOnSave) {
        router.push(redirectOnSave);
      } else {
        router.refresh();
      }
    } catch {
      setError("নেটওয়ার্কে সমস্যা হয়েছে। আবার চেষ্টা করো।");
      setBusy(false);
    }
  };

  return (
    <form className="form" onSubmit={submit} style={{ marginTop: 0 }}>
      {error ? (
        <div className="form-error" role="alert">
          {error}
        </div>
      ) : null}
      {success ? <div className="form-success">{success}</div> : null}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="profile-name">নাম</label>
          <input
            id="profile-name"
            className="input"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="profile-profession">পেশা</label>
          <input
            id="profile-profession"
            className="input"
            value={values.profession}
            onChange={(event) => update("profession", event.target.value)}
            placeholder="যেমন: সফটওয়্যার ইঞ্জিনিয়ার"
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <span className="field-label">এখন থাকি</span>
          <PlacePicker
            label="প্রবাসের শহর"
            value={values.cityId}
            options={cityOptions}
            onChange={(value) => update("cityId", value)}
            placeholder="শহর বেছে নাও"
            searchPlaceholder="শহর বা দেশ খোঁজো…"
          />
        </div>
        <div className="field">
          <span className="field-label">বাড়ি</span>
          <PlacePicker
            label="বাড়ির জেলা"
            value={values.districtId}
            options={districtOptions}
            onChange={(value) => update("districtId", value)}
            placeholder="জেলা বেছে নাও"
            searchPlaceholder="জেলা খোঁজো…"
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="profile-years">কত বছর প্রবাসে?</label>
          <input
            id="profile-years"
            className="input"
            type="number"
            min={0}
            max={70}
            value={values.yearsAbroad}
            onChange={(event) => update("yearsAbroad", event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="profile-photo">ছবির লিংক (ঐচ্ছিক)</label>
          <input
            id="profile-photo"
            className="input"
            value={values.photoUrl}
            onChange={(event) => update("photoUrl", event.target.value)}
            placeholder="https://…"
          />
          <span className="hint">না দিলে তোমার নামের আদ্যক্ষর দিয়ে সুন্দর অ্যাভাটার হবে।</span>
        </div>
      </div>

      {!compact ? (
        <div className="field">
          <label htmlFor="profile-bio">নিজের সম্পর্কে</label>
          <textarea
            id="profile-bio"
            className="textarea"
            value={values.bio}
            onChange={(event) => update("bio", event.target.value)}
            placeholder="প্রবাসে জীবন, দেশের স্মৃতি — দুটো লাইনে লেখো।"
            maxLength={320}
          />
        </div>
      ) : null}

      <label className="checkbox-row" htmlFor="profile-public">
        <input
          id="profile-public"
          type="checkbox"
          checked={values.isPublic}
          onChange={(event) => update("isPublic", event.target.checked)}
        />
        <span>
          আমার নাম, শহর আর জেলা মানচিত্রে দেখানো যাবে। বন্ধ করে দিলে শুধু
          তুমিই নিজের প্রোফাইল দেখতে পাবে।
        </span>
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-red" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={16} className="spin" /> সংরক্ষণ হচ্ছে…
            </>
          ) : (
            <>
              <Save size={16} /> সংরক্ষণ করো
            </>
          )}
        </button>
        {redirectOnSave || !cardHref ? null : (
          <Link href={cardHref} className="btn btn-outline">
            আমার কার্ড <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </form>
  );
}
