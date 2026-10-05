"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";

const linkGroups = [
  {
    title: "Quick Links",
    links: [
      { label: "For Founders", href: "/contact" },
      { label: "The Team", href: "/team" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Insights", href: "/news" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/" },
      { label: "Privacy Policy", href: "/" },
      { label: "AIF Registration Details", href: "/" },
    ],
  },
] as const;

export function Footer() {
  const subscribe = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <section className="footer-newsletter" aria-labelledby="newsletter-title">
          <h2 id="newsletter-title">Stay Updated With Our<br />Latest Insights &amp; Stories</h2>
          <form onSubmit={subscribe}>
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="Enter Your Email Address" required />
            <button className="button button-primary" type="submit">Subscribe <span aria-hidden="true">→</span></button>
          </form>
        </section>

        <nav className="footer-links" aria-label="Footer navigation">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              <ul>{group.links.map((link) => <li key={link.label}>{link.href.startsWith("/") ? <Link href={link.href}>{link.label}</Link> : <a href={link.href}>{link.label}</a>}</li>)}</ul>
            </div>
          ))}
        </nav>

        <div className="footer-bottom">
          <div className="footer-brand">
            <Image src="/brand/exfinity-footer.svg" alt="Exfinity" width={552} height={127} />
            <p>©2026 Exfinity All Right Reserved</p>
          </div>

          <address className="footer-contact">
            <div><strong>Phone</strong><a href="tel:+918068474100">+91 80 6847 4100</a></div>
            <div><strong>Email</strong><a href="mailto:info@exfinityventures.com">info@exfinityventures.com</a></div>
            <div><strong>Address</strong><span>10, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001</span></div>
            <div className="footer-socials">
              <a href="https://www.linkedin.com/company/exfinity-venture-partners" target="_blank" rel="noreferrer" aria-label="Exfinity on LinkedIn">in</a>
              <a href="https://x.com/ExfinityVP" target="_blank" rel="noreferrer" aria-label="Exfinity on X">𝕏</a>
            </div>
          </address>
        </div>
      </div>
    </footer>
  );
}
