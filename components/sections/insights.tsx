"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

const articles = [
  {
    title: "Exfinity at Inside India 2026: Engaging with a Senior Danish Delegation",
    image: "/insights/inside-india.png",
    date: "Feb 28, 2026",
    category: "Social",
  },
  {
    title: "Exfinity Venture Partners Unveils ₹1,100 Crore Fund IV for Deep-Tech Investments",
    image: "/insights/fund-four.png",
    date: "Jan 21, 2026",
    category: "News",
  },
  {
    title: "CloudSEK Becomes First Indian-Origin Cybersecurity Company to Receive Investment from a U.S. State Fund",
    image: "/insights/cloudsek.png",
    date: "Jan 15, 2026",
    category: "News",
  },
  {
    title: "Exfinity at Inside India 2026: Engaging with a Senior Danish Delegation",
    image: "/insights/inside-india.png",
    date: "Feb 28, 2026",
    category: "Social",
  },
] as const;

export function Insights() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);

  const closeModal = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closingRef.current = false;
      closeTimerRef.current = null;
    }, 360);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("exfinity:scroll-lock"));
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new Event("exfinity:scroll-unlock"));
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, closeModal]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("exfinity:scroll-unlock"));
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <>
      <section className="insights-section" aria-labelledby="insights-title">
        <div className="container">
          <div className="insights-kicker"><span aria-hidden="true" />Insights</div>
          <div className="insights-layout">
            <div className="insights-feature">
              <div className="insights-heading">
                <h2 id="insights-title">News &amp; Insights</h2>
                <a className="button button-outline" href="/insights">View all <span aria-hidden="true">→</span></a>
              </div>
              <div className="thesis-card">
                <Image src="/insights/physical-ai-thesis.png" alt="Exfinity Physical AI Thesis report" width={374} height={315} sizes="(max-width: 900px) 100vw, 38vw" />
                <p>A research-led view of the technologies, market shifts and emerging opportunities shaping the future of Indian deep tech and AI</p>
                <button className="button button-primary" type="button" onClick={() => { closingRef.current = false; setIsClosing(false); setIsOpen(true); }} aria-haspopup="dialog">
                  View thesis reports <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <div className="insights-grid">
              {articles.map((article, index) => (
                <article className="insight-card" key={`${article.title}-${index}`}>
                  <h3>{article.title}</h3>
                  <Image src={article.image} alt="" width={200} height={200} sizes="(max-width: 650px) 80vw, 200px" />
                  <div className="insight-meta"><time>{article.date}</time><span>{article.category}</span></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <div className={`modal-backdrop research-backdrop${isClosing ? " modal-closing" : ""}`} data-lenis-prevent role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className="research-modal" role="dialog" aria-modal="true" aria-labelledby="research-modal-title">
            <button ref={closeButtonRef} className="research-close" type="button" onClick={closeModal} aria-label="Close thesis form">×</button>
            <div className="research-summary">
              <h2 id="research-modal-title">A research-led view of the technologies, market shifts and emerging opportunities shaping the future of Indian deep tech and AI</h2>
              <Image src="/insights/physical-ai-thesis.png" alt="Physical AI Thesis report" width={460} height={350} sizes="(max-width: 700px) 90vw, 42vw" />
            </div>
            <form className="research-form" onSubmit={submit}>
              <label><span>Enter Your Name</span><input name="name" type="text" autoComplete="name" required /></label>
              <label><span>Enter Your Email Address</span><input name="email" type="email" autoComplete="email" required /></label>
              <label><span>Enter Your Company Name</span><input name="company" type="text" autoComplete="organization" required /></label>
              <button className="button button-primary" type="submit">Access thesis report <span aria-hidden="true">→</span></button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
