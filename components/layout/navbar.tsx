import Image from "next/image";
import Link from "next/link";

const navigation = [
  { label: "Portfolio", href: "#portfolio" },
  { label: "The Team", href: "#team" },
  { label: "Contact", href: "#contact" },
  { label: "News & Insights", href: "#insights" },
] as const;

export function Navbar() {
  return <header className="site-header"><nav className="navbar container" aria-label="Primary navigation">
    <Link className="brand" href="/" aria-label="Exfinity home"><Image src="/brand/exfinity-logo.svg" alt="Exfinity" width={203} height={47} priority /></Link>
    <div className="desktop-nav"><ul className="nav-links">{navigation.map(item => <li key={item.label}><Link href={item.href}>{item.label}</Link></li>)}</ul><Link className="button button-primary" href="#contact">Get in touch</Link></div>
    <details className="mobile-nav"><summary aria-label="Open navigation menu"><span /><span /><span /></summary><div className="mobile-nav-panel"><ul>{navigation.map(item => <li key={item.label}><Link href={item.href}>{item.label}</Link></li>)}</ul><Link className="button button-primary" href="#contact">Get in touch</Link></div></details>
  </nav></header>;
}
