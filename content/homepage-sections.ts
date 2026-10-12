export const fallbackCompanies = [
  { name: "Kinara AI", logo: "/companies/vector/kinara.svg", href: "/portfolio/kinara", width: 150, height: 50 },
  { name: "Ati Robotics", logo: "/companies/vector/ati.svg", href: "/portfolio/ati", width: 60, height: 35 },
  { name: "CloudSEK", logo: "/companies/vector/cloudsek.svg", href: "/portfolio/cloudsek", width: 135, height: 28 },
  { name: "Credilio", logo: "/companies/vector/credilio.svg", href: "/portfolio/credilio", width: 150, height: 50 },
  { name: "GridRaster", logo: "/companies/vector/gridraster.svg", href: "/portfolio/gridraster", width: 150, height: 50 },
  { name: "Maieutic", logo: "/companies/portfolio-provided/maieutic.svg", href: "/portfolio/maieutic", width: 150, height: 50 },
  { name: "Pixis", logo: "/companies/vector/pixis.svg", href: "/portfolio/pixis", width: 120, height: 60 },
  { name: "MoEngage", logo: "/companies/vector/moengage.svg", href: "/portfolio/moengage", width: 150, height: 50 },
  { name: "Zyla", logo: "/companies/vector/zyla.svg", href: "/portfolio/zyla-health", width: 150, height: 50 },
  { name: "Chara Motors", logo: "/companies/vector/chara.svg", href: "/portfolio/chara", width: 150, height: 40 },
  { name: "Optimized Electrotech", logo: "/companies/vector/optimized-electrotech.svg", href: "/portfolio/optimized-electrotech", width: 150, height: 50 },
  { name: "Str8bat", logo: "/companies/vector/str8bat.svg", href: "/portfolio/str8bat", width: 150, height: 50 },
] ;

export const fallbackCards = [
  {
    id: "deeptech",
    title: "DeepTech",
    image: "/what-we-back/deeptech.png",
    aboutLead: "Built on breakthroughs, guarded by complexity",
    copy: "Companies that turn hard science into products protected by proprietary IP, complex engineering, and years of R&D. Their moat is structural as competitors need science, talent, and time to catch up.",
    themes: ["Semiconductors & Computing", "Aerospace", "Advanced Materials & Manufacturing", "Energy & Climate Tech", "Robotics & Automation", "Defence & Dual-Use Technology", "Life Sciences"],
    companies: [
      { name: "Kinara", logo: "/companies/vector/kinara.svg", logoWhite: "/companies/vector/kinara-white.svg", href: "/portfolio/kinara" },
      { name: "Ati Robotics", logo: "/companies/vector/ati.svg", logoWhite: "/companies/vector/ati-white.svg", href: "/portfolio/ati" },
      { name: "Maieutic", logo: "/companies/portfolio-provided/maieutic.svg", logoWhite: "/companies/portfolio-provided/maieutic-white.svg", href: "/portfolio/maieutic" },
      { name: "Chara", logo: "/companies/vector/chara.svg", logoWhite: "/companies/vector/chara-white.svg", href: "/portfolio/chara" },
      { name: "Optimized Electrotech", logo: "/companies/vector/optimized-electrotech.svg", logoWhite: "/companies/vector/optimized-electrotech-white.svg", href: "/portfolio/optimized-electrotech" },
      { name: "Str8bat", logo: "/companies/vector/str8bat.svg", logoWhite: "/companies/vector/str8bat-white.svg", href: "/portfolio/str8bat" },
    ],
  },
  {
    id: "ai-native",
    title: "AI Native Software",
    image: "/what-we-back/ai-native.png",
    aboutLead: "Software that learns the business it serves",
    copy: "Products where intelligence is the core, using AI models and proprietary data to automate decisions and uncover insights at scale. Their moat grows with every use, as better data builds better models and deeper customer lock-in. The stack that helps build these self-learning products is also a part of this thesis.",
    themes: ["AI Agents & Autonomous Systems", "AI Infrastructure", "AI Developer Tools", "Data & ML Infrastructure", "AI Evals & Security", "Cybersecurity", "Vertical AI"],
    companies: [
      { name: "Pixis", logo: "/companies/vector/pixis.svg", logoWhite: "/companies/vector/pixis-white.svg", href: "/portfolio/pixis" },
      { name: "CloudSEK", logo: "/companies/vector/cloudsek.svg", logoWhite: "/companies/vector/cloudsek-white.svg", href: "/portfolio/cloudsek" },
      { name: "MoEngage", logo: "/companies/vector/moengage.svg", logoWhite: "/companies/vector/moengage-white.svg", href: "/portfolio/moengage" },
      { name: "Locus", logo: "/companies/vector/locus.svg", logoWhite: "/companies/vector/locus-white.svg", href: "/portfolio/locus" },
      { name: "NeuralGarage", logo: "/companies/vector/neural-garage.svg", logoWhite: "/companies/vector/neural-garage-white.svg", href: "/portfolio/neural-garage" },
      { name: "Eccentric", logo: "/companies/vector/eccentric.svg", logoWhite: "/companies/vector/eccentric-white.svg", href: "/portfolio/eccentric" },
    ],
  },
  {
    id: "b2b",
    title: "B2B Platforms",
    image: "/what-we-back/b2b-platforms.png",
    aboutLead: "The rails on which industries run",
    copy: "Platforms that bring fragmented businesses together or provide a unique product, with deep domain know-how and operational expertise built into every workflow. Their moat combines network effects with institutional knowledge that competitors can't copy.",
    themes: ["Industrial Platforms", "Health Technology", "AI Native Services"],
    companies: [
      { name: "Zyla", logo: "/companies/vector/zyla.svg", logoWhite: "/companies/vector/zyla-white.svg", href: "/portfolio/zyla-health" },
      { name: "Autoverse", logo: "/companies/vector/autoverse.svg", logoWhite: "/companies/vector/autoverse-white.svg", href: "/portfolio/autoverse" },
      { name: "Credilio", logo: "/companies/vector/credilio.svg", logoWhite: "/companies/vector/credilio-white.svg", href: "/portfolio/credilio" },
      { name: "Skit", logo: "/companies/vector/skit-ai.svg", logoWhite: "/companies/vector/skit-ai-white.svg", href: "/portfolio/skit-ai" },
    ],
  },
] ;

export const companiesDefaults = {
  heading: "Companies We Back",
  description: "From DeepTech to AI Native Softwares, these are companies we believed in at the earliest stage; now building for global markets",
  ctaLabel: "View Portfolio", ctaHref: "/portfolio", companies: fallbackCompanies,
};
export const backingDefaults = {
  kicker: "What we back", heading: "The Frontiers We Invest In",
  description: "We invest across three areas, each demanding deep expertise and offering the potential to create durable advantage at scale",
  ctaLabel: "View portfolio", ctaHref: "/portfolio", readMoreLabel: "Read more",
  aboutLabel: "About", themesLabel: "Select themes", cards: fallbackCards,
};
export type CompaniesSection = typeof companiesDefaults;
export type BackingSection = typeof backingDefaults;
