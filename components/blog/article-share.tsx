"use client";

import Image from "next/image";
import { useState } from "react";

export function ArticleShare({ title, url }: { title: string; url: string }) {
  const [status, setStatus] = useState("");
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied");
    } catch {
      setStatus("Please copy the link from your address bar");
    }
  }
  return <div className="article-share">
    <span>Share via</span>
    <div>
      <button type="button" onClick={copyLink} aria-label="Copy article link"><Image src="/icons/share-link.svg" alt="" width={35} height={35} /></button>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn"><Image src="/icons/share-linkedin.svg" alt="" width={35} height={35} /></a>
      <a href={`https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer" aria-label="Share on X"><Image src="/icons/share-twitter.svg" alt="" width={35} height={35} /></a>
    </div>
    <span className="article-share-status" role="status">{status}</span>
  </div>;
}
