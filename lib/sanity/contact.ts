import type { PortableTextBlock } from "sanity";
import defaults from "@/content/contact-faqs.json";
import { getPublishedSection } from "./sections";
export type ContactFaqSection = { kicker: string; heading: string; faqs: { question: string; answer: PortableTextBlock[] }[] };
export async function getContactFaqs(): Promise<ContactFaqSection> {
  const data = await getPublishedSection<ContactFaqSection>("contactFaqs", "kicker,heading,faqs[]{question,answer}");
  const fallback = defaults as ContactFaqSection;
  if (!data) return fallback;
  return { ...data, faqs: (data.faqs ?? []).filter((faq) => faq.question && faq.answer?.length), kicker: data.kicker ?? fallback.kicker, heading: data.heading ?? fallback.heading };
}
