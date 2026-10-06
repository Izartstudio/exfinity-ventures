"use client";

import { useState } from "react";
import Image, { type ImageLoaderProps } from "next/image";

export type TeamMember = {
  name: string;
  role: string;
  region: string;
  image: string;
  imagePosition?: string;
  funds?: string;
};

export type TeamDirectoryContent = {
  partnersTitle: string;
  foundersTitle: string;
  investmentTitle: string;
  tacTitle: string;
  partners: TeamMember[];
  founders: TeamMember[];
  investmentTeam: TeamMember[];
  tacTeam: TeamMember[];
};

const teamDirectoryContent: TeamDirectoryContent = {
  partnersTitle: "Partners",
  foundersTitle: "Founders & Advisors",
  investmentTitle: "Team",
  tacTitle: "TAC Team",
  partners: [
    { name: "Balakrishnan V", role: "General Partner & IC Member", region: "Silicon Valley & India", image: "/team/partners/balakrishnan-v.jpg", funds: "I, II, III" },
    { name: "Chinnu Senthilkumar", role: "General Partner & IC Member", region: "Silicon Valley & India", image: "/team/partners/chinnu-senthilkumar.jpg" },
    { name: "Shailesh Ghorpade", role: "General Partner & IC Member", region: "India", image: "/team/partners/shailesh-ghorpade.jpg" },
    { name: "Deepak Aggarwal", role: "Chief Finance Officer", region: "Silicon Valley & India", image: "/team/partners/deepak-aggarwal.jpg" },
    { name: "Girish Paranjpe", role: "Advisor & IC Member", region: "India", image: "/team/partners/girish-paranjpe.jpg" },
    { name: "Rajiv Kuchhal", role: "Advisor & IC Member", region: "India", image: "/team/partners/rajiv-kuchhal.jpg" },
    { name: "Deepak Ghaisas", role: "Advisor & IC Member", region: "India", image: "/team/partners/deepak-ghaisas.jpg" },
    { name: "Mohandas Pai TV", role: "Advisor & IC Member", region: "India", image: "/team/partners/mohandas-pai.jpg" },
    { name: "Jesper Ludolph", role: "Advisor & IC Member", region: "India, Middle East & South East Asia", image: "/team/partners/jesper-ludolph.jpg" },
    { name: "Rakesh Vaidyanathan", role: "Advisor & IC Member", region: "Silicon Valley", image: "/team/partners/rakesh-vaidyanathan.jpg" },
    { name: "Prabhu Antony", role: "Venture Partner", region: "USA", image: "/team/partners/prabhu-antony.jpg" },
  ],
  founders: [
    { name: "Deepak Ghaisas", role: "Advisor & IC Member", region: "India", image: "/team/founders/deepak-ghaisas.jpg" },
    { name: "Girish Paranjpe", role: "Advisor & IC Member", region: "India", image: "/team/founders/girish-paranjpe.jpg" },
    { name: "Mohandas Pai TV", role: "Advisor & IC Member", region: "India", image: "/team/founders/mohandas-pai.jpg" },
    { name: "Rajiv Kuchhal", role: "Advisor & IC Member", region: "India", image: "/team/founders/rajiv-kuchhal.jpg" },
  ],
  investmentTeam: [
    { name: "Nitin Lalwani", role: "AVP - Investor Relations", region: "India", image: "/team/investment/nitin-lalwani.jpg" },
    { name: "Prachi Singh", role: "VP - Operations", region: "India", image: "/team/investment/prachi-singh.jpg" },
    { name: "Sunith Mandala", role: "Principal", region: "India", image: "/team/investment/sunith-mandala.jpg" },
    { name: "Arundhati Menon", role: "AVP - Investments", region: "India", image: "/team/investment/arundhati-menon.jpg" },
    { name: "Afreed Faizan", role: "Investment Analyst", region: "India", image: "/team/investment/afreed-faizan.jpg" },
    { name: "R Abhijith Menon", role: "Operations & IR Analyst", region: "India", image: "/team/investment/abhijith-menon.jpg" },
  ],
  tacTeam: [
    { name: "Balaji", role: "TAC Member", region: "India", image: "/team/tac/balaji.png" },
    { name: "Vikas Sharma", role: "TAC Member", region: "India", image: "/team/tac/vikas-sharma.png" },
    { name: "Rahul Sasi", role: "TAC Member", region: "India", image: "/team/tac/rahul-sasi.png" },
  ],
};

const cmsImageLoader = ({ src }: ImageLoaderProps) => src;

function TeamGrid({ members, label }: { members: TeamMember[]; label: string }) {
  return (
    <div className="team-member-grid" aria-label={label}>
      {members.map((member) => (
        <article className="team-member-card" key={member.name}>
          <div className="team-member-image">
            <Image
              fill
              unoptimized
              loader={cmsImageLoader}
              src={member.image}
              alt={member.name}
              sizes="(max-width: 650px) calc(100vw - 2.5rem), (max-width: 900px) 48vw, 24vw"
              style={{ objectPosition: member.imagePosition ?? "center center" }}
            />
          </div>
          <div className="team-member-copy">
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <span>{member.region}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

export function TeamDirectory({ content = teamDirectoryContent }: { content?: TeamDirectoryContent }) {
  const [activeTab, setActiveTab] = useState<"partners" | "founders" | "tac">("partners");
  const isPartners = activeTab === "partners";
  const isFounders = activeTab === "founders";
  const isTac = activeTab === "tac";

  return (
    <section className="team-directory" aria-labelledby="team-directory-title">
      <div className="container">
        <div className="section-kicker"><span>The Team</span></div>

        <div className="team-tabs" role="tablist" aria-label="Team categories">
          <button type="button" role="tab" aria-selected={isPartners} aria-controls="partners-panel" id="partners-tab" className={isPartners ? "is-active" : ""} onClick={() => setActiveTab("partners")}>{content.partnersTitle}</button>
          <button type="button" role="tab" aria-selected={isFounders} aria-controls="founders-panel" id="founders-tab" className={isFounders ? "is-active" : ""} onClick={() => setActiveTab("founders")}>{content.foundersTitle}</button>
          <button type="button" role="tab" aria-selected={isTac} aria-controls="tac-panel" id="tac-tab" className={isTac ? "is-active" : ""} onClick={() => setActiveTab("tac")}>{content.tacTitle}</button>
        </div>

        {isPartners ? (
          <div id="partners-panel" role="tabpanel" aria-labelledby="partners-tab">
            <h2 id="team-directory-title">{content.partnersTitle}</h2>
            <TeamGrid members={content.partners} label={content.partnersTitle} />
            <div className="investment-team-block">
              <h2>{content.investmentTitle}</h2>
              <TeamGrid members={content.investmentTeam} label={content.investmentTitle} />
            </div>
          </div>
        ) : isFounders ? (
          <div id="founders-panel" role="tabpanel" aria-labelledby="founders-tab">
            <h2 id="team-directory-title">{content.foundersTitle}</h2>
            <TeamGrid members={content.founders} label={content.foundersTitle} />
          </div>
        ) : (
          <div id="tac-panel" role="tabpanel" aria-labelledby="tac-tab">
            <h2 id="team-directory-title">{content.tacTitle}</h2>
            <TeamGrid members={content.tacTeam} label={content.tacTitle} />
          </div>
        )}
      </div>
    </section>
  );
}
