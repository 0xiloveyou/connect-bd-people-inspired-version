import { initials } from "@/lib/format";

type AvatarProps = {
  name: string;
  color?: string | null;
  photoUrl?: string | null;
  size?: number;
  className?: string;
  radius?: number;
};

export function Avatar({
  name,
  color,
  photoUrl,
  size = 32,
  className = "",
  radius,
}: AvatarProps) {
  const background = color ?? "#0b6e4f";
  return (
    <span
      className={`mini-avatar ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius ?? "50%",
        background: `linear-gradient(145deg, ${background} 0%, #04140f 140%)`,
        fontSize: Math.max(10, Math.round(size * 0.34)),
      }}
      aria-hidden="true"
    >
      {photoUrl ? (
        // User supplied photo. Kept as a plain img so no remote host allow-list is needed.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            borderRadius: radius ?? "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
