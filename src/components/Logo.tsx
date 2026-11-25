import Link from "next/link";

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="প্রবাসে — হোম">
      <span className="logo-text" style={small ? { fontSize: 22 } : undefined}>
        প্রবাসে
      </span>
      <span className="logo-dot" aria-hidden="true" />
      <span className="logo-en">probashé</span>
    </Link>
  );
}
