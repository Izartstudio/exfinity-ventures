"use client";

import { useState } from "react";
import { PortableText } from "next-sanity";
import type { ContactFaqSection } from "@/lib/sanity/contact";

export function ContactFaqs({ content }: { content: ContactFaqSection }) {
  const { faqs } = content;
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
      <div className="contact-faq-kicker"><span>{content.kicker}</span><i /></div>
      <div className="contact-faq-layout">
        <h2 id="contact-faq-title">{content.heading}</h2>
        <div className="contact-faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndexes.has(index);
            return <div className={`contact-faq-item${isOpen ? " is-open" : ""}`} key={faq.question}>
              <button type="button" aria-expanded={isOpen} aria-controls={`faq-panel-${index}`} onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span><i aria-hidden="true" />
              </button>
              <div className="contact-faq-panel" id={`faq-panel-${index}`} role="region" aria-hidden={!isOpen}><div><PortableText value={faq.answer} /></div></div>
            </div>;
          })}
        </div>
      </div>
    </div>
  </section>;
}
