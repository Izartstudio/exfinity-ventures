import { Navbar } from "@/components/layout/navbar";
import type { ReactNode } from "react";
import Link from "next/link";

export function TeamHero({ title = <>Experience that<br />Goes Beyond Capital</>, description, cta }: { title?: ReactNode; description?: ReactNode; cta?: { label: string; href: string } }) {
  return (
    <section className="team-hero" aria-labelledby="team-hero-title">
      <div className="team-hero-gradient" aria-hidden="true" />
      <div className="team-hero-dots" aria-hidden="true" />
      <Navbar />
      <div className="team-hero-content container">
        <h1 id="team-hero-title">{title}</h1>
        {(description || cta) && <div className="team-hero-aside">
          {description && <p>{description}</p>}
          {cta && <Link className="button button-primary" href={cta.href}>{cta.label} <span aria-hidden="true">→</span></Link>}
        </div>}
      </div>
    </section>
  );
}
