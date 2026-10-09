"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { teamDirectoryContent, teamMemberSlug, type TeamDirectoryContent, type TeamMember } from "@/content/team";

export type TeamTab = "partners" | "founders" | "tac";

function TeamGrid({ members, label, activeTab }: { members: TeamMember[]; label: string; activeTab: TeamTab }) {
  return (
    <div className="team-member-grid" aria-label={label}>
      {members.map((member) => (
        <Link className="team-member-card" href={{ pathname: `/team/${teamMemberSlug(member.name)}`, query: { from: activeTab } }} key={member.name} aria-label={`View ${member.name}'s profile`}>
          <div className="team-member-image">
            <Image
              fill
              src={member.image}
              alt={member.name}
              quality={90}
              sizes="(max-width: 650px) calc(100vw - 2.5rem), (max-width: 900px) 48vw, 24vw"
              style={{ objectPosition: member.imagePosition ?? "center center" }}
            />
          </div>
          <div className="team-member-copy">
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function TeamDirectory({ content = teamDirectoryContent, initialTab = "partners" }: { content?: TeamDirectoryContent; initialTab?: TeamTab }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TeamTab>(initialTab);
  const isPartners = activeTab === "partners";
  const isFounders = activeTab === "founders";
  const isTac = activeTab === "tac";

  function selectTab(tab: TeamTab) {
    setActiveTab(tab);
    router.replace(`/team?tab=${tab}`, { scroll: false });
  }

  return (
    <section className="team-directory" aria-labelledby="team-directory-title">
      <div className="container">
        <div className="section-kicker"><span>The Team</span></div>

        <div className="team-tabs" role="tablist" aria-label="Team categories">
          <button type="button" role="tab" aria-selected={isPartners} aria-controls="partners-panel" id="partners-tab" className={isPartners ? "is-active" : ""} onClick={() => selectTab("partners")}>{content.partnersTitle}</button>
          <button type="button" role="tab" aria-selected={isTac} aria-controls="tac-panel" id="tac-tab" className={isTac ? "is-active" : ""} onClick={() => selectTab("tac")}><span>Technical Advisory</span>{" "}<span className="tac-tab-last-word">Committee</span></button>
          <button type="button" role="tab" aria-selected={isFounders} aria-controls="founders-panel" id="founders-tab" className={isFounders ? "is-active" : ""} onClick={() => selectTab("founders")}>{content.foundersTitle}</button>
        </div>

        {isPartners ? (
          <div id="partners-panel" role="tabpanel" aria-labelledby="partners-tab">
            <h2 id="team-directory-title">{content.partnersTitle}</h2>
            <TeamGrid members={content.partners} label={content.partnersTitle} activeTab="partners" />
            <div className="investment-team-block">
              <h2>{content.investmentTitle}</h2>
              <TeamGrid members={content.investmentTeam} label={content.investmentTitle} activeTab="partners" />
            </div>
          </div>
        ) : isFounders ? (
          <div id="founders-panel" role="tabpanel" aria-labelledby="founders-tab">
            <h2 id="team-directory-title">{content.foundersTitle}</h2>
            <TeamGrid members={content.founders} label={content.foundersTitle} activeTab="founders" />
          </div>
        ) : (
          <div id="tac-panel" role="tabpanel" aria-labelledby="tac-tab">
            <h2 id="team-directory-title"><span>Technical Advisory</span>{" "}<span className="tac-heading-last-word">Committee</span></h2>
            <TeamGrid members={content.tacTeam} label={content.tacTitle} activeTab="tac" />
          </div>
        )}
      </div>
    </section>
  );
}
