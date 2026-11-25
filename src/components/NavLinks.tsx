"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/map", label: "মানচিত্র" },
  { href: "/districts", label: "জেলাগুলো" },
  { href: "/ranking", label: "র‍্যাংকিং" },
  { href: "/idea", label: "আইডিয়া" },
];

export function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(`${link.href}/`));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={mobile ? undefined : `nav-link${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {mobile ? (
              <>
                <span>{link.label}</span>
                <span aria-hidden="true">→</span>
              </>
            ) : (
              link.label
            )}
          </Link>
        );
      })}
    </>
  );
}
