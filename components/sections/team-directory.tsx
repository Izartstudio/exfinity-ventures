"use client";

import { useState } from "react";
import Image, { type ImageLoaderProps } from "next/image";
import Link from "next/link";
import { teamDirectoryContent, teamMemberSlug, type TeamDirectoryContent, type TeamMember } from "@/content/team";

const cmsImageLoader = ({ src }: ImageLoaderProps) => src;

function TeamGrid({ members, label }: { members: TeamMember[]; label: string }) {
  return (
    <div className="team-member-grid" aria-label={label}>
      {members.map((member) => (
        <Link className="team-member-card" href={`/team/${teamMemberSlug(member.name)}`} key={member.name} aria-label={`View ${member.name}'s profile`}>
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
        </Link>
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
