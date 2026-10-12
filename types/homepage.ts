export type HomepageStat = {
  value: string;
  label: string;
};

export type HomepageFounder = {
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
  logoUrl?: string;
};

export type HomepageFoundersSection = {
  heading: string;
  layout: "three" | "five";
  founders: HomepageFounder[];
};

export function founderSlot(index: number, active: number, count: number, layout: HomepageFoundersSection["layout"]) {
  let offset = (index - active + count) % count;
  if (offset > count / 2) offset -= count;
  return { offset: Math.max(-3, Math.min(3, offset)), visible: Math.abs(offset) <= (layout === "five" ? 2 : 1) };
}
