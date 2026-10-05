"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Portfolio", href: "/portfolio", match: "/portfolio" },
  { label: "The Team", href: "/team", match: "/team" },
  { label: "Contact", href: "/contact", match: "/contact" },
  { label: "News & Insights", href: "/news", match: "/news" },
] as const;

export function Navbar({ theme = "dark" }: { theme?: "dark" | "light" | "split" }) {
  const pathname = usePathname();

  return <header className={`site-header site-header-${theme}`}><nav className="navbar container" aria-label="Primary navigation">
    <Link className="brand" href="/" aria-label="Exfinity home"><Image src={theme === "light" ? "/brand/exfinity-footer.svg" : "/brand/exfinity-logo.svg"} alt="Exfinity" width={203} height={47} priority /></Link>
    <div className="desktop-nav"><ul className="nav-links">{navigation.map(item => { const active = pathname === item.match || pathname.startsWith(`${item.match}/`); return <li key={item.label}><Link className={active ? "is-active" : undefined} href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link></li>; })}</ul><Link className="button button-primary" href="/contact">Pitch to us</Link></div>
    <details className="mobile-nav"><summary aria-label="Open navigation menu"><span /><span /><span /></summary><div className="mobile-nav-panel"><ul>{navigation.map(item => { const active = pathname === item.match || pathname.startsWith(`${item.match}/`); return <li key={item.label}><Link className={active ? "is-active" : undefined} href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link></li>; })}</ul><Link className="button button-primary" href="/contact">Pitch to us</Link></div></details>
  </nav></header>;
}
