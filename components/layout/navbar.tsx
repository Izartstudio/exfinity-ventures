"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "Portfolio", href: "/portfolio", match: "/portfolio" },
  { label: "The Team", href: "/team", match: "/team" },
  { label: "Contact", href: "/contact", match: "/contact" },
  { label: "News & Insights", href: "/news", match: "/news" },
] as const;

const lightSurfaceSelector = [
  ".what-we-back",
  ".philosophy-scroll",
  ".companies-we-back",
  ".insights-section",
  ".contact-faqs",
  ".team-directory",
  ".offices-section",
  ".news-ledger",
  ".portfolio-section",
  ".article-hero",
  ".article-body",
  ".aif-details",
  ".pre-footer",
  ".site-footer",
  ".research-modal",
].join(",");

export function Navbar({ theme }: { theme?: "dark" | "light" | "split" }) {
  const pathname = usePathname();
  const effectiveTheme = theme ?? (pathname.startsWith("/news/") || pathname === "/aif-registration-details" ? "light" : pathname.startsWith("/portfolio/") ? "split" : "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [useDarkLogo, setUseDarkLogo] = useState(effectiveTheme === "light");
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const updateLogoTone = () => {
      const brand = document.querySelector<HTMLElement>(".brand");
      const bounds = brand?.getBoundingClientRect();
      const x = bounds ? bounds.left + bounds.width / 2 : 40;
      const y = bounds ? bounds.top + bounds.height / 2 : 28;
      const surfaceIsLight = document
        .elementsFromPoint(x, y)
        .some((element) => !element.closest(".site-header") && Boolean(element.closest(lightSurfaceSelector)));

      setUseDarkLogo(surfaceIsLight || (window.scrollY < 2 && effectiveTheme === "light"));
    };

    updateLogoTone();

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        updateLogoTone();
        frame.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [effectiveTheme]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("exfinity:scroll-lock"));
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new Event("exfinity:scroll-unlock"));
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const isActive = (match: string) => pathname === match || pathname.startsWith(`${match}/`);
  const closeMenu = () => setMenuOpen(false);
  const darkLogoActive = menuOpen || useDarkLogo;

  return (
    <header className={`site-header site-header-${effectiveTheme}${menuOpen ? " is-menu-open" : ""}`}>
      <nav className="navbar container" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Exfinity home" onClick={closeMenu}>
          <Image className={`brand-logo brand-logo-light${darkLogoActive ? " is-inactive" : ""}`} src="/brand/exfinity-logo.svg" alt="" width={203} height={47} priority />
          <Image className={`brand-logo brand-logo-dark${darkLogoActive ? " is-active" : ""}`} src="/brand/exfinity-logo-dark.svg" alt="" width={203} height={47} priority />
        </Link>

        <div className="desktop-nav">
          <ul className="nav-links">
            {navigation.map((item) => {
              const active = isActive(item.match);
              return <li key={item.label}><Link className={active ? "is-active" : undefined} href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link></li>;
            })}
          </ul>
          <Link className="button button-primary navbar-cta" href="/contact">Pitch to us <span aria-hidden="true">→</span></Link>
        </div>

        <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <span className="mobile-menu-close" aria-hidden="true">×</span> : <><span /><span /><span /></>}
        </button>

        <div className="mobile-nav-panel" id="mobile-navigation" aria-hidden={!menuOpen} inert={!menuOpen}>
          <ul className="mobile-primary-links">
            {navigation.map((item) => {
              const active = isActive(item.match);
              return <li key={item.label}><Link className={active ? "is-active" : undefined} href={item.href} aria-current={active ? "page" : undefined} onClick={closeMenu}>{item.label}</Link></li>;
            })}
          </ul>

          <div className="mobile-nav-footer">
            <Link className="button button-primary mobile-pitch-cta" href="/contact" onClick={closeMenu}>Pitch to us</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
