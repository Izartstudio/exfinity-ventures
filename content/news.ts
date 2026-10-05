export type NewsCategory = "Social" | "News" | "Newsletters";

export type NewsItem = {
  id: string;
  title: string;
  image: string;
  date: string;
  category: NewsCategory;
  slug: string;
  imagePosition?: string;
};

// This mirrors the shape expected from the CMS collection.
export const newsItems: NewsItem[] = [
  { id: "inside-india-2026", title: "Exfinity at Inside India 2026: Engaging with a Senior Danish Delegation", image: "/news/news-1.jpg", date: "Feb 28, 2026", category: "Social", slug: "/news/inside-india-2026" },
  { id: "fund-four", title: "Exfinity Venture Partners Unveils ₹1,100 Crore Fund IV for Deep-Tech Investments", image: "/news/news-2.jpg", date: "Jan 21, 2026", category: "News", slug: "/news/fund-four" },
  { id: "cloudsek-state-fund", title: "CloudSEK Becomes First Indian-Origin Cybersecurity Company to Receive Investment from a U.S. State Fund", image: "/news/news-3.jpg", date: "Jan 15, 2026", category: "News", slug: "/news/cloudsek-state-fund" },
  { id: "chara-series-a", title: "Chara Technologies raises Rs 52 crore to expand rare-earth-free motor manufacturing", image: "/news/news-4.jpg", date: "Feb 28, 2026", category: "News", slug: "/news/chara-series-a" },
  { id: "ikea-locus", title: "IKEA arm acquires India-born logistics tech startup Locus", image: "/news/news-5.jpg", date: "Oct 07, 2025", category: "News", slug: "/news/ikea-locus" },
  { id: "maieutic-funding", title: "Deeptech startup Maieutic Semiconductor raises $4.15 million from Exfinity Venture Partners", image: "/news/news-6.jpg", date: "Feb 28, 2026", category: "News", slug: "/news/maieutic-funding" },
  { id: "deeptech-dispatch", title: "The DeepTech Dispatch: Building enduring technology companies from India", image: "/news/news-2.jpg", date: "Sep 18, 2025", category: "Newsletters", slug: "/news/deeptech-dispatch" },
  { id: "founder-network", title: "Inside the Exfinity founder network: Ideas, ambition and global scale", image: "/news/news-4.jpg", date: "Aug 12, 2025", category: "Social", slug: "/news/founder-network" },
  { id: "ai-native-briefing", title: "The AI Native Briefing: Infrastructure, agents and the next software cycle", image: "/news/news-6.jpg", date: "Jul 24, 2025", category: "Newsletters", slug: "/news/ai-native-briefing" },
];
