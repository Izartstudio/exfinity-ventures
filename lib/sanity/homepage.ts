import type { HomepageFounder, HomepageStat } from "@/types/homepage";

const fallbackStats: HomepageStat[] = [
  { value: "40+", label: "Companies Across The Portfolio" },
  { value: "$4.5B+", label: "Enterprise Value Created Across The Portfolio" },
  { value: "300+", label: "Patents Filed Across The Portfolio" },
];

type SanityResponse = { result?: { stats?: HomepageStat[] } };

const fallbackFounders: HomepageFounder[] = [
  { name: "Founder", role: "Founder & CEO", quote: "Exfinity backed our ambition early and remained a committed partner as we built for a global market.", imageUrl: "/founders/founder-1.png" },
  { name: "Founder", role: "Founder & CEO", quote: "Their combination of conviction, patience, and operating perspective made them an invaluable partner.", imageUrl: "/founders/founder-2.png" },
  { name: "Shubham Mishra", role: "Founder & CEO", quote: "They were our first investors and they stayed with us through several product pivots. Chinnu introduced us to our first major customer, which is now a million-dollar account.", imageUrl: "/founders/founder-3.png" },
  { name: "Founder", role: "Founder & CEO", quote: "They understood the technology, the market, and the scale of what we were setting out to build.", imageUrl: "/founders/founder-4.png" },
  { name: "Founder", role: "Founder & CEO", quote: "From the earliest days, Exfinity worked alongside us with the focus and perspective of a true partner.", imageUrl: "/founders/founder-5.png" },
];

export async function getHomepageStats(): Promise<HomepageStat[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return fallbackStats;

  const query = encodeURIComponent(
    `*[_type == "homepageStats"][0]{"stats": stats[]{value,label}}`,
  );
  const url = `https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}?query=${query}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return fallbackStats;
    const data = (await response.json()) as SanityResponse;
    const stats = data.result?.stats?.filter((stat) => stat.value && stat.label);
    return stats?.length ? stats : fallbackStats;
  } catch {
    return fallbackStats;
  }
}

type FoundersResponse = { result?: { founders?: HomepageFounder[] } };

export async function getHomepageFounders(): Promise<HomepageFounder[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return fallbackFounders;

  const query = encodeURIComponent(
    `*[_type == "homepageFounders"][0]{"founders": founders[]{name,role,quote,"imageUrl":image.asset->url}}`,
  );
  const url = `https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}?query=${query}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return fallbackFounders;
    const data = (await response.json()) as FoundersResponse;
    const founders = data.result?.founders?.filter(
      (founder) => founder.name && founder.role && founder.quote && founder.imageUrl,
    );
    return founders && founders.length >= 3 ? founders : fallbackFounders;
  } catch {
    return fallbackFounders;
  }
}
