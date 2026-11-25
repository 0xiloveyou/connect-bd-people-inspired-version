import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { ShareCard } from "@/components/ShareCard";
import { distanceForMember, getUserCard } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return { title: "কার্ড পাওয়া যায়নি" };
  const user = await getUserCard(numericId);
  if (!user || !user.isPublic) return { title: "কার্ড পাওয়া যায়নি" };
  return {
    title: `${user.name} — প্রবাসের শেয়ার কার্ড`,
    description: `${user.name} — ${user.city?.nameBn ?? "প্রবাসে"}${
      user.city ? `, ${user.city.countryBn}` : ""
    } থেকে ${user.district?.nameBn ?? "বাংলাদেশ"}। প্রবাসে বাংলাদেশের মানুষের মানচিত্রে যোগ দাও।`,
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId <= 0) notFound();

  const [user, current, headerList] = await Promise.all([
    getUserCard(numericId),
    getCurrentUser(),
    headers(),
  ]);

  if (!user) notFound();
  const isOwner = current?.id === user.id;
  if (!user.isPublic && !isOwner) notFound();

  const host = headerList.get("host") ?? "localhost:3000";
  const proto =
    headerList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const pageUrl = `${proto}://${host}/card/${user.id}`;
  const siteLabel = host.replace(/^www\./, "");

  const qrDataUrl = await QRCode.toDataURL(pageUrl, {
    width: 260,
    margin: 1,
    color: { dark: "#0b2b22", light: "#fffdf8" },
  });

  return (
    <div className="share-page">
      <ShareCard
        member={{
          id: user.id,
          name: user.name,
          avatarColor: user.avatarColor,
          photoUrl: user.photoUrl,
          profession: user.profession,
          yearsAbroad: user.yearsAbroad,
          city: user.city
            ? { nameBn: user.city.nameBn, countryBn: user.city.countryBn }
            : null,
          district: user.district ? { nameBn: user.district.nameBn } : null,
          distanceKm: distanceForMember(user),
        }}
        qrDataUrl={qrDataUrl}
        pageUrl={pageUrl}
        siteLabel={siteLabel}
      />
    </div>
  );
}
