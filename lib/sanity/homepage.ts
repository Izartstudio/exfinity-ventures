import type { HomepageFounder, HomepageStat } from "@/types/homepage";

const fallbackStats: HomepageStat[] = [
  { value: "40+", label: "Companies Across The Portfolio" },
  { value: "$4.5B+", label: "Enterprise Value Created Across The Portfolio" },
  { value: "300+", label: "Patents Filed Across The Portfolio" },
];

type StatsResponse = { result?: { stats?: HomepageStat[] } };

type FoundersResponse = {
  result?: {
    founders?: Array<{
      name?: string;
      role?: string;
      quote?: string;
      imageUrl?: string;
    }>;
  };
};

const fallbackFounders: HomepageFounder[] = [
  { name: "Shubham Mishra", role: "Co-founder & CEO, Pixis", quote: "Exfinity’s B2B focus, domain expertise and conviction in their founders has been vital in our journey. They were our 1st investors and continued to trust us through our multiple product pivots. Chinnu introduced us to our first major customer - which is now a million-dollar account for Pixis", imageUrl: "/founders/featured/shubham-mishra.png", logoUrl: "/companies/vector/pixis-white.svg" },
  { name: "Raviteja Dodda", role: "Co-founder & CEO, MoEngage", quote: "Exfinity has been one of the few investors who understand Enterprise Software, and have been early believers in the 'India SaaS for the World' opportunity right from 2014.", imageUrl: "/founders/featured/moengage-founder.png", logoUrl: "/companies/vector/moengage-white.svg" },
  { name: "Ravi Annavajjihala", role: "CEO, Kinara AI", quote: "Exfinity facilitated the setup of our R&D center in Hyderabad, providing us both a cost and scale advantage. They have furthermore opened doors to many partners and customers – and been instrumental in our Series B, bringing the right investors to our cap table.", imageUrl: "/founders/featured/kinara-founder.png", logoUrl: "/companies/vector/kinara-white.svg" },
  { name: "Khushboo Aggarwal", role: "Founder, Zyla Health", quote: "Exfinity has the risk appetite to enter new areas like healthcare and the expertise to help with corporate GTM strategy. Their board involvement has helped us immensely with new customers, better GTM strategy and hiring.", imageUrl: "/founders/featured/zyla-founder.jpg", logoUrl: "/companies/vector/zyla-white.svg" },
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
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallbackStats;
    const data = (await response.json()) as StatsResponse;
    const stats = data.result?.stats?.filter((stat) => stat.value && stat.label);
    return stats?.length ? stats : fallbackStats;
  } catch {
    return fallbackStats;
  }
}

export async function getHomepageFounders(): Promise<HomepageFounder[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return fallbackFounders;

  const query = encodeURIComponent(
    `*[_type == "homepageFounders" && !(_id in path("drafts.**"))][0]{"founders": founders[]{name,role,quote,"imageUrl": image.asset->url}}`,
  );
  const url = `https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}?query=${query}&perspective=published`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallbackFounders;
    const data = (await response.json()) as FoundersResponse;
    const founders = data.result?.founders
      ?.filter((founder) => founder.name && founder.role && founder.quote && founder.imageUrl)
      .map((founder) => {
        const fallback = fallbackFounders.find((item) => item.name === founder.name);
        return {
          name: founder.name!,
          role: founder.role!,
          quote: founder.quote!,
          imageUrl: founder.imageUrl!,
          logoUrl: fallback?.logoUrl,
        };
      });
    return founders?.length ? founders : fallbackFounders;
  } catch {
    return fallbackFounders;
  }
}
