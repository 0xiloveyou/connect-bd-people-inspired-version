"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lightbulb, Loader2, Send } from "lucide-react";
import { bn } from "@/lib/format";

export function IdeaForm({
  initialName = "",
  initialEmail = "",
}: {
  initialName?: string;
  initialEmail?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (message.trim().length < 5) {
      setError("একটু বিস্তারিত লিখো (অন্তত ৫ অক্ষর)।");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          email: email.trim() || null,
          message: message.trim(),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok) {
        setError(data.error ?? "আইডিয়া পাঠানো যায়নি।");
        setBusy(false);
        return;
      }
      setDone(true);
      setMessage("");
      setBusy(false);
      router.refresh();
    } catch {
      setError("নেটওয়ার্কে সমস্যা হয়েছে। আবার চেষ্টা করো।");
      setBusy(false);
    }
  };

  return (
    <div className="form-card">
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span className="feature-icon" aria-hidden="true">
          <Lightbulb size={20} />
        </span>
        <div>
          <h2 className="form-title" style={{ fontSize: 24 }}>
            তোমার আইডিয়া বলো
          </h2>
          <p className="form-sub">
            নতুন ফিচার, জেলার গল্প, মিটআপ — যা মনে আসে লিখে পাঠাও।
          </p>
        </div>
      </div>

      {done ? (
        <div className="form-success" role="status">
          <CheckCircle2
            size={16}
            style={{ display: "inline", verticalAlign: -2, marginRight: 6 }}
          />
          ধন্যবাদ! তোমার আইডিয়া আমাদের কাছে পৌঁছেছে।
        </div>
      ) : null}

      <form className="form" onSubmit={submit}>
        {error ? (
          <div className="form-error" role="alert">
            {error}
          </div>
        ) : null}

        <div className="form-grid">
          <div className="field">
            <label htmlFor="idea-name">তোমার নাম (ঐচ্ছিক)</label>
            <input
              id="idea-name"
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="নাম লিখো"
              maxLength={60}
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label htmlFor="idea-email">ইমেইল (ঐচ্ছিক)</label>
            <input
              id="idea-email"
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tumi@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="idea-message">আইডিয়া</label>
          <textarea
            id="idea-message"
            className="input"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="যেমন: জেলা ভিত্তিক মিটআপ আয়োজন করলে ভালো হয়…"
            rows={6}
            maxLength={1500}
            required
            style={{ height: "auto", padding: "12px 14px", resize: "vertical" }}
          />
          <span className="muted" style={{ fontSize: 11, textAlign: "right" }}>
            {bn(message.length)} / ১৫০০
          </span>
        </div>

        <button type="submit" className="btn btn-red" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={16} className="spin" /> পাঠানো হচ্ছে…
            </>
          ) : (
            <>
              <Send size={16} /> আইডিয়া পাঠাও
            </>
          )}
        </button>

        <p className="form-note">
          তুমি চাইলে নাম আর ইমেইল না দিয়েও পাঠাতে পারো। ইমেইল শুধু উত্তর দেওয়ার
          জন্য ব্যবহার হবে।
        </p>
      </form>
    </div>
  );
}
