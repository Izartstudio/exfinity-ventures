export type PortfolioStatus = "Active" | "Exited";
export type PortfolioFund = "Fund I" | "Fund II" | "Fund III";

export type PortfolioCompany = {
  id: string;
  name: string;
  logo?: string;
  fund: PortfolioFund;
  sector: string;
  status: PortfolioStatus;
  tagline?: string;
  description?: string;
  partneredSince?: string;
  entryStage?: string;
  founders?: string[];
  exfinityTeam?: string[];
  linkedinUrl?: string;
  websiteUrl?: string;
};

export type PortfolioWallData = {
  sectionLabel: string;
  companies: PortfolioCompany[];
};

export const updatedPortfolioLogos: Record<string, string> = {
  ati: "/companies/featured/ati.png",
  maieutic: "/companies/popup/maieutic-provided.png",
  chara: "/companies/featured/chara.png",
  "raga-ai": "/companies/featured/raga-ai.webp",
  cloudsek: "/companies/featured/cloudsek.png",
  moengage: "/companies/popup/moengage-provided.png",
  pixis: "/companies/featured/pixis.png",
  eccentric: "/companies/popup/eccentric.png",
};

// Mirrors the collection shape used by the CMS. Logo remains optional so a
// newly-created entry never breaks the wall while its artwork is being added.
export const portfolioCompanies: PortfolioCompany[] = [
  { id: "ati", name: "Ati Robotics", logo: updatedPortfolioLogos.ati, fund: "Fund III", sector: "Robotics", status: "Active", tagline: "Autonomous mobile robots for the real world", description: "Ati builds intelligent autonomous robots that help industrial teams move materials safely and efficiently.", partneredSince: "2023", entryStage: "Seed", founders: ["Saurabh Chandra"], exfinityTeam: ["Exfinity Venture Partners"] },
  { id: "maieutic", name: "Maieutic", logo: updatedPortfolioLogos.maieutic, fund: "Fund III", sector: "Semiconductors", status: "Active", tagline: "GenAI Copilot for Chip Design", description: "Maieutic offers seamless interoperability across existing EDA toolchains, enabling unified AI-driven decision-making. Its adaptive intelligence continuously learns from diverse data and user feedback, creating a compounding knowledge base that accelerates every design cycle.", partneredSince: "2022", entryStage: "Seed", founders: ["Gireesh Rajendran", "Ashish Lachhwani", "Rakesh Kumar"], exfinityTeam: ["Sunith Mandala", "Chinnu Senthilkumar"] },
  { id: "chara", name: "Chara", logo: updatedPortfolioLogos.chara, fund: "Fund III", sector: "EV Tech", status: "Active" },
  { id: "raga-ai", name: "RagaAI", logo: updatedPortfolioLogos["raga-ai"], fund: "Fund III", sector: "Ops", status: "Active" },
  { id: "awiros", name: "Awiros", fund: "Fund III", sector: "Enterprise SaaS", status: "Active" },
  { id: "qritive", name: "Qritive", fund: "Fund III", sector: "Health Tech", status: "Active" },
  { id: "cloudsek", name: "CloudSEK", logo: updatedPortfolioLogos.cloudsek, fund: "Fund II", sector: "Cybersecurity", status: "Active" },
  { id: "log9", name: "LOG9", fund: "Fund II", sector: "Battery Tech", status: "Active" },
  { id: "moengage", name: "MoEngage", logo: updatedPortfolioLogos.moengage, fund: "Fund I", sector: "SaaS", status: "Exited" },
  { id: "pixis", name: "Pixis", logo: updatedPortfolioLogos.pixis, fund: "Fund II", sector: "Marketing Tech", status: "Active" },
  { id: "neural-garage", name: "NeuralGarage", fund: "Fund III", sector: "Generative AI", status: "Active" },
  { id: "eccentric", name: "Eccentric", logo: updatedPortfolioLogos.eccentric, fund: "Fund III", sector: "Automotive", status: "Active" },
];

export const fallbackPortfolioWall: PortfolioWallData = {
  sectionLabel: "Our Portfolio",
  companies: portfolioCompanies,
};
