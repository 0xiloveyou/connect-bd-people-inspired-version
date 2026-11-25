import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHead({
  eyebrow,
  title,
  lead,
  href,
  linkLabel = "সব দেখো",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  href?: string;
  linkLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div className="section-head-copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className="h2">{title}</h2>
        {lead ? <p className="lead">{lead}</p> : null}
        {children}
      </div>
      {href ? (
        <Link href={href} className="section-link">
          {linkLabel} <ArrowRight size={16} />
        </Link>
      ) : null}
    </div>
  );
}
