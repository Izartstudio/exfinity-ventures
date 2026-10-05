"use client";

import { useState, type ReactNode } from "react";

type Faq = { question: string; answer: ReactNode };

const faqs: Faq[] = [
  {
    question: "What does Exfinity invest in?",
    answer: <>Early-stage (Seed to Series A) B2B startups building around Deep-Technology, AI Native softwares, and B2B Platforms. Our focus includes semiconductors, AI and computing hardware, physical AI &amp; robotics, cybersecurity, AI-native software &amp; vertical AI, and scalable enterprise platforms. We back founders building from India for global enterprises.</>,
  },
  {
    question: "What stage and cheque size?",
    answer: <>We lead or co-lead seed to Series A rounds with a $2–3M going-in cheque and reserve capital for follow-ons.</>,
  },
  {
    question: "Do you only invest in Indian companies?",
    answer: <>No. We invest in companies incorporated in India, the US, and Singapore. Our focus is founders of Indian origin building for global markets, supported by partners across all three geographies.</>,
  },
  {
    question: "Do you invest in single-founder companies?",
    answer: <>No. We look for founding teams with at least two co-founders who together cover the technical and commercial sides of the business. Having said that, we have also seen exceptional cases.</>,
  },
  {
    question: "What do you offer beyond capital?",
    answer: <ul><li>Warm CXO introductions that convert into first pilots/ customers.</li><li>We help in hiring the first core team members; critical for company building</li><li>We connect the portfolio with our VC and CVC network for uprounds and strategic investments</li><li>Provide insights on the competitor landscape and macro trends</li><li>Alongside a partner who sits on the Board, a senior team member is assigned to help the company at every stage (beyond board meetings).</li></ul>,
  },
  {
    question: "What do you look for?",
    answer: <>We look for complementary founding teams combining product depth with market focus, backed by early signals: a POC, a first customer, or an enterprise partnership.</>,
  },
  {
    question: "Do we invest in consumer tech and D2C Brands?",
    answer: <>No we do not invest in any consumer tech or D2C brands, we invest only in B2B &amp; Enterprise technologies</>,
  },
  {
    question: "How do I pitch?",
    answer: <>Send your deck, demo, or data room to <a href="mailto:info@exfinityventures.com">info@exfinityventures.com.</a></>,
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
