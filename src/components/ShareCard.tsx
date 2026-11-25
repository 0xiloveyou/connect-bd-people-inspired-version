"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Loader2,
  Share2,
  Sparkles,
} from "lucide-react";
import { bn, initials } from "@/lib/format";

export type ShareMember = {
  id: number;
  name: string;
  avatarColor: string;
  photoUrl: string | null;
  profession: string | null;
  yearsAbroad: number;
  city: { nameBn: string; countryBn: string } | null;
  district: { nameBn: string } | null;
  distanceKm: number | null;
};

export function ShareCard({
  member,
  qrDataUrl,
  pageUrl,
  siteLabel,
}: {
  member: ShareMember;
  qrDataUrl: string;
  pageUrl: string;
  siteLabel: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");

  const fileName = `probash-${member.name
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
    .replace(/^-+|-+$/g, "") || member.id}.png`;

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    setNote("");
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#f7f1e6",
      });
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch {
      setNote("ছবি তৈরি করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setNote("লিংক কপি করা যায়নি। ব্রাউজার থেকে কপি করো।");
    }
  };

  const share = async () => {
    const text = `${member.name} — প্রবাসে ${member.city?.nameBn ?? ""}${
      member.distanceKm !== null ? `, বাড়ি থেকে ${bn(member.distanceKm)} কিমি দূরে` : ""
    }`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "প্রবাসে", text, url: pageUrl });
      } catch {
        /* user cancelled */
      }
      return;
    }
    await copy();
  };

  return (
    <div className="container share-grid">
      <div className="share-copy">
        <span className="eyebrow">শেয়ার কার্ড</span>
        <h1>
          প্রবাসের ঠিকানা,
          <br />
          <span>একটা কার্ডে</span>
        </h1>
        <p>
          {member.name}-এর প্রবাসের গল্প — {member.city?.nameBn ?? "শহর"}
          {member.city ? `, ${member.city.countryBn}` : ""} থেকে{" "}
          {member.district?.nameBn ?? "দেশ"} পর্যন্ত। কার্ডটা ডাউনলোড করে
          সোশ্যাল মিডিয়ায় শেয়ার করো, অথবা লিংকটা বন্ধুদের পাঠাও।
        </p>

        <div className="share-actions">
          <button type="button" className="btn btn-red" onClick={download} disabled={busy}>
            {busy ? (
              <>
                <Loader2 size={16} className="spin" /> কার্ড তৈরি হচ্ছে…
              </>
            ) : (
              <>
                <Download size={16} /> কার্ড ডাউনলোড
              </>
            )}
          </button>
          <button type="button" className="btn btn-ghost" onClick={share}>
            <Share2 size={16} /> শেয়ার করো
          </button>
          <button type="button" className="btn btn-ghost" onClick={copy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "কপি হয়েছে" : "লিংক কপি"}
          </button>
        </div>

        {note ? (
          <p className="share-hint" role="alert" style={{ color: "#ffb3bd" }}>
            {note}
          </p>
        ) : null}

        <p className="share-hint">
          <Sparkles
            size={12}
            style={{ display: "inline", verticalAlign: -2, marginRight: 4 }}
          />
          কার্ডে তোমার নাম, শহর, বাড়ির জেলা আর দূরত্ব থাকে — কোনো ইমেইল বা
          ব্যক্তিগত তথ্য নয়।
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 4 }}>
          <Link href="/map" className="section-link" style={{ color: "var(--gold)" }}>
            <ArrowLeft size={14} /> মানচিত্রে ফিরে যাও
          </Link>
          <Link href="/join" className="section-link" style={{ color: "var(--gold)" }}>
            নিজের কার্ড বানাও →
          </Link>
        </div>
      </div>

      <div className="share-card-wrap">
        <div className="share-card" ref={cardRef}>
          <div className="share-card-inner">
            <div className="share-brand">
              <span>
                প্রবাসে <small>Probashé</small>
              </span>
              <span className="share-flag" aria-hidden="true" />
            </div>

            <div className="share-person">
              <span
                className="share-avatar"
                style={{
                  background: `linear-gradient(145deg, ${member.avatarColor} 0%, #04140f 150%)`,
                }}
              >
                {member.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photoUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 15,
                    }}
                  />
                ) : (
                  initials(member.name)
                )}
              </span>
              <div>
                <h2>{member.name}</h2>
                <span>
                  {member.profession ?? "প্রবাসী"}
                  {member.yearsAbroad > 0
                    ? ` · ${bn(member.yearsAbroad)} বছর প্রবাসে`
                    : ""}
                </span>
              </div>
            </div>

            <div className="share-route">
              <div className="share-route-row">
                <span>এখন থাকি</span>
                <b>
                  {member.city
                    ? `${member.city.nameBn}, ${member.city.countryBn}`
                    : "শহর যোগ করা হয়নি"}
                </b>
              </div>
              <div className="share-route-row">
                <span>বাড়ি</span>
                <b>{member.district?.nameBn ?? "জেলা যোগ করা হয়নি"}</b>
              </div>
              <div className="share-distance">
                <b>
                  {member.distanceKm !== null ? bn(member.distanceKm) : "—"}
                </b>
                <span>{member.distanceKm !== null ? "কিমি দূরে" : "দূরত্ব অজানা"}</span>
              </div>
            </div>

            <div className="share-bottom">
              <p>
                <b>{siteLabel}</b>
                সারা পৃথিবী থেকে এক সুতোয় দেশে
              </p>
              <span className="share-qr">
                {/* QR is generated on the server as a data URL. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt={`${member.name}-এর কার্ডের QR কোড`} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
