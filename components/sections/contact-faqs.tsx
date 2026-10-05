"use client";

import { useState, type ReactNode } from "react";

type Faq = { question: string; answer: ReactNode };

const faqs: Faq[] = [
  {
    question: "What kind of sectors does Exfinity invest in?",
    answer: <>Three themes: AI-Powered Software (applied AI across applications, governance and silicon, plus cybersecurity); DeepTech (semiconductors and computing including quantum and photonics, energy and materials, space tech, and selective shorter-cycle life sciences); and B2B Platforms (fintech, health tech, B2B marketplaces).</>,
  },
  {
    question: "When is the right time to get in touch?",
    answer: <>We typically invest at the Seed and Series A stages, but it&apos;s never too early to reach out. We like to brainstorm with entrepreneurs and aspiring founders, and build relationships well before we invest.</>,
  },
  {
    question: "What are your typical cheque sizes?",
    answer: <>We typically invest between $0.5 Million and $4 Million, depending on the opportunity and round.</>,
  },
  {
    question: "Do you lead/co-lead/participate in a round with other investors?",
    answer: <>Yes. We are open to leading, co-leading or participating alongside other investors, depending on the structure and requirements of the round.</>,
  },
  {
    question: "How do I get in touch?",
    answer: <>You can email us at <a href="mailto:info@exfinityventures.com">info@exfinityventures.com</a>, or reach out directly to any member of our team.</>,
  },
  {
    question: "What does Exfinity invest in?",
    answer: <>Early-stage Deep Technology, AI Native, and B2B Platforms. Our focus includes semiconductors, AI and computing hardware, physical AI and robotics, cybersecurity, AI-native software, and scalable enterprise platforms. We back founders of Indian origin across Bengaluru, the Bay Area, and Singapore, investing in companies incorporated in all three. Most of our companies engineer in India and sell globally.</>,
  },
  {
    question: "What stage and cheque size?",
    answer: <>We lead or co-lead seed to Series A rounds with a $2–3M going-in cheque and reserve capital for follow-ons.</>,
  },
  {
    question: "Do you only invest in Indian companies?",
    answer: <>No. The focus is companies that build their product and technology in India while selling into both Indian and global markets. Some portfolio entities are domiciled offshore with Indian engineering bases.</>,
  },
  {
    question: "Do you invest in single-founder companies?",
    answer: <>No. We look for founding teams with at least two co-founders who together cover the technical and commercial sides of the business.</>,
  },
  {
    question: "What do you offer beyond capital?",
    answer: <>Operator-led, hands-on support at the Investment Manager&apos;s own expense: enterprise customer introductions, senior leadership hiring, go-to-market and product strategy, governance and finance-function build-out with mandatory external audits, follow-on and growth capital introductions, and exit preparation including early acquirer mapping.</>,
  },
  {
    question: "What do you look for?",
    answer: <>A technical founding team, defensible IP, a clear global market, and the ambition to build a category leader. Revenue at seed helps, though it is optional.</>,
  },
  {
    question: "How do I pitch?",
    answer: <>Send your deck, demo, or data room to <a href="mailto:info@exfinityventures.com">info@exfinityventures.com</a>.</>,
  },
];

export function ContactFaqs() {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => new Set([0]));

  const toggleFaq = (index: number) => {
    setOpenIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return <section className="contact-faqs" aria-labelledby="contact-faq-title">
    <div className="container">
      <div className="contact-faq-kicker"><span>FAQs</span><i /></div>
      <div className="contact-faq-layout">
        <h2 id="contact-faq-title">What Founders<br />Need to Know</h2>
        <div className="contact-faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndexes.has(index);
            return <div className={`contact-faq-item${isOpen ? " is-open" : ""}`} key={faq.question}>
              <button type="button" aria-expanded={isOpen} aria-controls={`faq-panel-${index}`} onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span><i aria-hidden="true" />
              </button>
              <div className="contact-faq-panel" id={`faq-panel-${index}`} role="region" aria-hidden={!isOpen}><div>{faq.answer}</div></div>
            </div>;
          })}
        </div>
      </div>
    </div>
  </section>;
}
