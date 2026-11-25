import Link from "next/link";
import { haversineKm } from "@/lib/distance";
import { bn, formatKm, initials } from "@/lib/format";

export type MemberCardData = {
  id: number;
  name: string;
  avatarColor: string;
  photoUrl: string | null;
  yearsAbroad: number;
  city: { nameBn: string; countryBn: string; lat: number; lng: number } | null;
  district: {
    nameBn: string;
    slug: string;
    lat: number;
    lng: number;
  } | null;
};

export function MemberCard({
  member,
  compact = false,
}: {
  member: MemberCardData;
  compact?: boolean;
}) {
  const distance =
    member.city && member.district
      ? Math.round(
          haversineKm(
            { lat: member.city.lat, lng: member.city.lng },
            { lat: member.district.lat, lng: member.district.lng },
          ),
        )
      : null;

  return (
    <Link
      className="person"
      href={`/card/${member.id}`}
      aria-label={`${member.name} — ${member.city?.nameBn ?? ""}`}
    >
      <span
        className="person-photo"
        style={{
          background: `linear-gradient(145deg, ${member.avatarColor} 0%, #04140f 145%)`,
        }}
      >
        {member.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span aria-hidden="true">{initials(member.name)}</span>
        )}
        {member.yearsAbroad > 0 ? (
          <i className="person-years">{bn(member.yearsAbroad)} বছর</i>
        ) : (
          <i className="person-years">নতুন</i>
        )}
      </span>
      <b className="person-name">{member.name}</b>
      <span className="person-place">
        {member.city ? `${member.city.nameBn}, ${member.city.countryBn}` : "শহর যোগ করা হয়নি"}
      </span>
      <span className="person-home">
        {member.district ? `বাড়ি ${member.district.nameBn}` : "জেলা যোগ করা হয়নি"}
      </span>
      {distance !== null ? (
        <span className="person-km">{formatKm(distance)} দূরে</span>
      ) : (
        <span className="person-km">{compact ? "" : "দূরত্ব আসছে"}</span>
      )}
    </Link>
  );
}

export function MemberGrid({
  members,
  compact = false,
}: {
  members: MemberCardData[];
  compact?: boolean;
}) {
  return (
    <div className={`people-grid${compact ? " compact" : ""}`}>
      {members.map((member) => (
        <MemberCard key={member.id} member={member} compact={compact} />
      ))}
    </div>
  );
}
