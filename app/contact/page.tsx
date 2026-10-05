import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { ContactFaqs } from "@/components/sections/contact-faqs";
import { TeamHero } from "@/components/sections/team-hero";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Contact Exfinity Venture Partners to share your company, pitch or investment enquiry with our team.",
  path: "/contact",
});

export default function ContactPage() {
  return <>
    <main>
      <TeamHero
        title={<>Let&apos;s Start a<br />Conversation</>}
        description={<>Send us a note with your company, what you&apos;re building,<br />and where you are in your journey. We&apos;ll take it from there.</>}
        cta={{ label: "Write to us", href: "mailto:info@exfinityventures.com" }}
      />
      <ContactFaqs />
    </main>
    <Footer />
  </>;
}
