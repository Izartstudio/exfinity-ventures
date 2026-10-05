import Link from "next/link";

type PreFooterProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function PreFooter({
  title = "Building Technology That Could Define a Category?",
  description = "We back founders combining technical depth with the ambition to build category-defining companies from India for global markets.",
  ctaLabel = "Pitch to us",
  ctaHref = "/contact",
}: PreFooterProps) {
  const guideLines = Array.from({ length: 29 }, (_, index) => 25 + index * 51);
  const waveformBars = [
    { x: 25, y: 337, width: 15, height: 36, opacity: 0.68 },
    { x: 76, y: 319, width: 15, height: 71, opacity: 0.58 },
    { x: 127, y: 302, width: 15, height: 105, opacity: 0.5 },
    { x: 178, y: 285, width: 15, height: 140, opacity: 0.42 },
    { x: 229, y: 267, width: 15, height: 175, opacity: 0.34 },
    { x: 280, y: 249, width: 15, height: 212, opacity: 0.27 },
    { x: 330, y: 231, width: 15, height: 246, opacity: 0.19 },
    { x: 381, y: 215, width: 15, height: 278, opacity: 0.08 },
  ] as const;

  return (
    <section className="pre-footer" id="contact" aria-labelledby="pre-footer-title">
      <svg className="pre-footer-background" viewBox="0 0 1440 710" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="prefooter-bar-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dce8ff" />
            <stop offset=".48" stopColor="#075dff" />
            <stop offset="1" stopColor="#dce8ff" />
          </linearGradient>
          <linearGradient id="prefooter-guide-gradient" x1="0" y1="0" x2="0" y2="710" gradientUnits="userSpaceOnUse">
            <stop stopColor="#cfd7e6" stopOpacity="0" />
            <stop offset=".16" stopColor="#cfd7e6" stopOpacity=".02" />
            <stop offset=".36" stopColor="#cfd7e6" stopOpacity=".12" />
            <stop offset=".6" stopColor="#cfd7e6" stopOpacity=".45" />
            <stop offset="1" stopColor="#cfd7e6" stopOpacity=".58" />
          </linearGradient>
        </defs>
        <rect width="1440" height="710" fill="#fff" />
        <g stroke="url(#prefooter-guide-gradient)" strokeWidth="1">
          {guideLines.map((x) => <line x1={x} y1="0" x2={x} y2="710" key={x} />)}
        </g>
        <g fill="url(#prefooter-bar-gradient)">
          {waveformBars.map((bar) => <rect {...bar} key={`left-${bar.x}`} />)}
          {waveformBars.map((bar) => <rect x={1440 - bar.x - bar.width} y={bar.y} width={bar.width} height={bar.height} opacity={bar.opacity} key={`right-${bar.x}`} />)}
        </g>
        <rect x="396" y="0" width="648" height="710" fill="url(#prefooter-center-fade)" />
        <defs>
          <linearGradient id="prefooter-center-fade" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".18" stopColor="#fff" stopOpacity=".96" />
            <stop offset=".82" stopColor="#fff" stopOpacity=".96" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="709.5" x2="1440" y2="709.5" stroke="#d5deed" />
      </svg>
      <div className="pre-footer-content">
        <h2 id="pre-footer-title">{title}</h2>
        <div className="pre-footer-rule" aria-hidden="true"><span /></div>
        <p>{description}</p>
        <Link className="button button-primary" href={ctaHref}>
          {ctaLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
