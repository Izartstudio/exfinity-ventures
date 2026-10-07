import Link from "next/link";
import { AdaptiveHeroVideo } from "@/components/sections/adaptive-hero-video";

export function Hero() {
  return <section className="hero" aria-labelledby="hero-heading">
    <AdaptiveHeroVideo />
    <div className="hero-gradient" aria-hidden="true" />
    <div className="hero-content container"><h1 id="hero-heading"><span className="hero-title-desktop">Backing Global Innovation<br />Across DeepTech, AI Native<br />Software &amp; B2B Platforms</span><span className="hero-title-mobile">Backing Global Innovation<br />Across DeepTech,<br />AI Native Software &amp;<br />B2B Platforms</span></h1><div className="hero-actions"><p>Pioneering DeepTech<br />Investing in India since 2014</p><div className="hero-buttons"><Link className="button button-primary" href="/contact">Pitch to us</Link><Link className="button button-outline" href="/portfolio">Portfolio <span aria-hidden="true">→</span></Link></div></div></div>
  </section>;
}
