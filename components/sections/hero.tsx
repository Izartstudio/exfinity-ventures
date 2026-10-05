import Link from "next/link";

export function Hero() {
  return <section className="hero" aria-labelledby="hero-heading">
    <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/videos/hero-poster.jpg" aria-hidden="true"><source src="/videos/hero.mp4" type="video/mp4" /></video>
    <div className="hero-gradient" aria-hidden="true" />
    <div className="hero-content container"><h1 id="hero-heading">Backing Global Innovation<br />Across DeepTech, AI Native<br />Software &amp; B2B Platforms</h1><div className="hero-actions"><p>Pioneering DeepTech.<br />Investing in India since 2014.</p><div className="hero-buttons"><Link className="button button-primary" href="/contact">Pitch to us</Link><Link className="button button-outline" href="/portfolio">Portfolio <span aria-hidden="true">→</span></Link></div></div></div>
  </section>;
}
