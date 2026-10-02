import { getHomepageStats } from "@/lib/sanity/homepage";

export async function Stats() {
  const stats = await getHomepageStats();
  return <section className="stats-section" aria-label="Exfinity portfolio statistics"><div className="stats-glow" aria-hidden="true" /><div className="stats-grid container">{stats.map((stat) => <article className="stat-card" key={`${stat.value}-${stat.label}`}><strong>{stat.value}</strong><p>{stat.label}</p></article>)}</div></section>;
}
