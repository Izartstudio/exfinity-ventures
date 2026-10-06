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

export function teamMemberSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const teamDirectoryContent: TeamDirectoryContent = {
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
