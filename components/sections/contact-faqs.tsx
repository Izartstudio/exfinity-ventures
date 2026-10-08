"use client";

import { useState, type ReactNode } from "react";

type Faq = { question: string; answer: ReactNode };

const faqs: Faq[] = [
  {
    question: "What does Exfinity invest in?",
    answer: <>We invest in early-stage B2B startups at the <em>Seed, Pre-Series A, and Series A</em> stages, building across <em>DeepTech, AI-Native Software, and B2B Platforms</em>.</>,
  },
  {
    question: "What kind of themes does Exfinity invest in?",
    answer: <><p>Our investment themes span three sectors:</p><ul><li><strong>DeepTech:</strong> Semiconductors &amp; Computing, Aerospace, Advanced Materials &amp; Manufacturing, Energy &amp; Climate Tech, Robotics &amp; Automation, Defence &amp; Dual-Use Technology, and Life Sciences.</li><li><strong>AI-Native Software:</strong> AI Agents &amp; Autonomous Systems, AI Infrastructure, AI Developer Tools, AI Evals &amp; Security, Cybersecurity, Data &amp; ML Infrastructure, and Vertical AI.</li><li><strong>B2B Platforms:</strong> Industrial Platforms, Healthcare, and AI-Native Services.</li></ul></>,
  },
  {
    question: "When is the right time to get in touch?",
    answer: <>We typically invest at the <em>Seed, Pre-Series A, and Series A</em> stages, but it&apos;s never too early to reach out. We like to brainstorm with entrepreneurs and aspiring founders and build relationships well before we invest.</>,
  },
  {
    question: "What are your typical cheque sizes?",
    answer: <>We typically invest between <em>$0.5 million and $4 million</em>, depending on the opportunity and round size. We also reserve capital for follow-on investments.</>,
  },
  {
    question: "Do you lead, co-lead, or participate in rounds with other investors?",
    answer: <>Yes. We are open to <em>leading, co-leading, or participating</em> alongside other investors, depending on the structure and requirements of the round.</>,
  },
  {
    question: "How do I get in touch?",
    answer: <>You can email us at <a href="mailto:info@exfinityventures.com"><em>info@exfinityventures.com</em></a> or reach out directly to any member of our team.</>,
  },
  {
    question: "Do you only invest in Indian companies?",
    answer: <>No. We invest in companies incorporated in <em>India, the US, and Singapore</em>. Our focus is on founders of Indian origin building for global markets, supported by our network and partners across all three geographies.</>,
  },
  {
    question: "What do you look for?",
    answer: <>We look for <em>complementary founding teams</em> that combine strong product and technical depth with market focus, backed by early signals such as a <em>POC, first customer, or enterprise partnership</em>.</>,
  },
  {
    question: "Do you invest in single-founder companies?",
    answer: <>We generally look for founding teams with <em>at least two co-founders</em> who collectively cover the technical and commercial aspects of the business. That said, we have backed exceptional founders and teams who may not fit this profile.</>,
  },
  {
    question: "What do you offer beyond capital?",
    answer: <><p>Beyond capital, we support founders with:</p><ul><li><strong>Customer access:</strong> Warm CXO introductions that can convert into pilots and customers.</li><li><strong>Hiring:</strong> Support in hiring the first core team members, which is critical to company building.</li><li><strong>Fundraising &amp; strategic capital:</strong> Connections to our VC and CVC network for future rounds and strategic investments.</li><li><strong>Market intelligence:</strong> Insights on the competitive landscape and broader macro trends.</li><li><strong>Hands-on support:</strong> Alongside a Partner who sits on the Board, a senior team member works closely with the company at every stage, beyond formal board meetings.</li></ul></>,
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
