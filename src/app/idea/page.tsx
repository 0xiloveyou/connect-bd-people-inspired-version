import type { Metadata } from "next";
import { Lightbulb, MessageSquareHeart, Sparkles } from "lucide-react";
import { IdeaForm } from "@/components/IdeaForm";
import { getIdeas } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { bnDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "আইডিয়া পাঠাও",
  description:
    "প্রবাসে মানচিত্রকে আরও ভালো করতে তোমার আইডিয়া জানাও — নতুন ফিচার, জেলার গল্প বা মিটআপের পরিকল্পনা।",
};

export default async function IdeaPage() {
  const [ideas, user] = await Promise.all([getIdeas(8), getCurrentUser()]);

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">তোমার কথা</span>
          <h1>
            এই মানচিত্র
            <br />
            <span>তোমার হাতেও গড়ে উঠুক</span>
          </h1>
          <p className="lead">
            কোন ফিচার দরকার, কোন জেলার গল্প আগে জানতে চাও, নাকি প্রবাসে মিটআপ
            আয়োজন করতে চাও? তোমার আইডিয়া আমাদের পরের ধাপ ঠিক করে দেবে।
          </p>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div className="ideas-layout">
            <IdeaForm
              initialName={user?.name ?? ""}
              initialEmail={user?.email ?? ""}
            />

            <aside>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 14,
                }}
              >
                <span className="feature-icon" aria-hidden="true">
                  <MessageSquareHeart size={19} />
                </span>
                <div>
                  <h2 style={{ fontSize: 21 }}>সাম্প্রতিক আইডিয়া</h2>
                  <p className="muted" style={{ fontSize: 12 }}>
                    কমিউনিটি থেকে আসা কিছু ভাবনা
                  </p>
                </div>
              </div>

              {ideas.length === 0 ? (
                <div className="empty-state">
                  <b>এখনো কোনো আইডিয়া নেই</b>
                  তুমিই প্রথম আইডিয়াটা পাঠাও।
                </div>
              ) : (
                <div className="idea-list">
                  {ideas.map((idea) => (
                    <article className="idea-item" key={idea.id}>
                      <div className="idea-item-head">
                        <b>{idea.name?.trim() || "নামহীন প্রবাসী"}</b>
                        <span>{bnDate(idea.createdAt)}</span>
                      </div>
                      <p>{idea.message}</p>
                    </article>
                  ))}
                </div>
              )}

              <div className="side-card" style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 17 }}>
                  <Sparkles
                    size={16}
                    style={{ display: "inline", verticalAlign: -2, color: "var(--red-600)", marginRight: 5 }}
                  />
                  পরের পরিকল্পনা
                </h3>
                <p className="muted" style={{ fontSize: 12 }}>
                  জেলা ভিত্তিক মিটআপ, প্রবাসী ব্যবসার তালিকা আর দেশে ফেরার
                  গাইড — তোমার ভোটেই কোনটা আগে হবে ঠিক হবে।
                </p>
                <div className="chip-row">
                  <span className="chip">
                    <Lightbulb size={11} /> নতুন ফিচার
                  </span>
                  <span className="chip gold">মিটআপ</span>
                  <span className="chip red">গল্প</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
