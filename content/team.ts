export type TeamMember = {
  name: string;
  role: string;
  region: string;
  image: string;
  imagePosition?: string;
  funds?: string;
  biography?: string[];
  portfolioCompanyIds?: string[];
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
  partnersTitle: "Partners & IC",
  foundersTitle: "Founding Sponsors",
  investmentTitle: "Team",
  tacTitle: "TAC Team",
  partners: [
    {
      name: "Balakrishnan V",
      role: "Chairman of the IC",
      region: "Silicon Valley & India",
      image: "/team/partners/balakrishnan-v.jpg",
      funds: "I, II, III",
      portfolioCompanyIds: ["uniken", "practically", "locus", "agshift"],
      biography: [
        "Prior to founding Exfinity, Bala served as Head of BPO, Finacle & India Business Unit at Infosys. Bala also served as the Chief Financial Officer of Infosys Ltd., from May 1, 2006 to October 31, 2012.",
        "Bala served as Secretary and Senior Vice President – Finance of Infosys Ltd., from joining it in 2001 to April 2006. He was a full-time Director on the Board of Infosys Limited from June 2011 to December 2013.",
        "Bala has significant experience in leadership positions in the finance domain, with expertise in Corporate Finance, International Taxation, Risk Management and Mergers & Acquisitions.",
        "He has been a recipient of the “Best CFO” award from CNBC and Finance Asia.",
      ],
    },
    {
      name: "Chinnu Senthilkumar",
      role: "Managing Partner and IC Member",
      region: "Silicon Valley & India",
      image: "/team/partners/chinnu-senthilkumar.jpg",
      funds: "I, II, III, IV",
      biography: [
        "Chinnu has been Managing Partner at Exfinity since its inception in 2013. Over three funds, he has championed 15+ deals out of a 40-company portfolio, including successes such as Pixis.AI, CloudSEK, Kinara.AI, Chara and Ati Motors. As a board member across many of these investments, he has actively guided multiple seed-to-exit journeys: driving product development, market expansion and organisational scale-up.",
        "Beyond direct investing, Chinnu has facilitated growth-stage capital from marquee investors including SoftBank, General Atlantic, Tiger Global, TSMC and Petronas into the portfolio. He has also led fundraising for Exfinity Funds II and III, drawing commitments from institutions such as Western Digital (NASDAQ-listed), government fund-of-funds including EDF (Electronics Development Fund, sponsored by MeitY and SIDBI), and UHNI family offices including that of Azim Premji.",
        "Prior to founding Exfinity, Chinnu brought 15 years of executive experience leading semiconductor enterprises across Silicon Valley and India, including Intel, SanDisk and Texas Instruments. At SanDisk, he led the company's India operations and served as CEO of its Indian subsidiary.",
      ],
    },
    {
      name: "Girish Paranjpe",
      role: "Advisor and IC Member",
      region: "India",
      image: "/team/partners/girish-paranjpe.jpg",
      funds: "I, II, III, IV",
      portfolioCompanyIds: ["uniken", "practically", "locus", "agshift"],
      biography: [
        "Girish Paranjpe is a founding partner of Exfinity Ventures and brings over three decades of leadership experience in global technology and business services. He served as Joint CEO of Wipro's IT Business, where he helped scale the company into a global enterprise spanning over 50 countries, and subsequently as President of Wipro's Finance Solutions division. Earlier in his career at Wipro, he held several senior roles across business units and geographies, building deep expertise in enterprise technology, digital transformation and large-scale P&L management.",
        "Following his executive career, Girish has been an active investor and board advisor across technology and growth-stage companies. He brings to Exfinity a distinctive combination of operational depth, global enterprise networks and boardroom experience with a particular focus on helping portfolio companies navigate international expansion, enterprise sales and organisational maturity.",
      ],
    },
    {
      name: "Jesper Ludolph",
      role: "General Partner and IC Member",
      region: "India, Middle East & South East Asia",
      image: "/team/partners/jesper-ludolph.jpg",
      funds: "II, III, IV",
      biography: [
        "Jesper brings over two decades of global leadership experience across consulting, private equity and entrepreneurship, having lived and worked in 30+ countries across Europe, Asia and India. He has led value-creation programs at PE-backed companies Navico and Provimi through to successful exits, and spent a decade as Partner at McKinsey & Company driving large-scale transformations in energy, high-tech, pharma and logistics.",
        "At Exfinity Ventures, Jesper serves as General Partner with a particular focus on global GTM, strategic partnerships and executive coaching for founders. He leads Commercial & Leadership due diligence during investment evaluation and drives global LP engagement. Within the fund, he also serves as Compliance Officer for the Scheme. Since joining, he has played an active role in shaping the new fund's strategy and fundraising, while working closely with portfolio companies on operational challenges, organisational design and board governance.",
      ],
    },
    {
      name: "Rajiv Kuchhal",
      role: "General Partner and IC Member",
      region: "India",
      image: "/team/partners/rajiv-kuchhal.jpg",
      funds: "I, II, III, IV",
      biography: [
        "Rajiv is a Founding Partner and General Partner at Exfinity, where he helped establish Exfinity Technology Fund and launch Fund I, serving on the Investment Committee and multiple boards with a strong focus on techno-commercial deal structuring and global expansion for portfolio companies. Drawing on nearly three decades of senior leadership across Infosys, Progeon/Infosys BPO and OnMobile, and over 15 years as an active early-stage investor and mentor (including social enterprises), he brings deep operating, governance and strategic scaling experience into his VC role.",
      ],
    },
    {
      name: "Rakesh Vaidyanathan",
      role: "General Partner and IC Member",
      region: "Silicon Valley",
      image: "/team/partners/rakesh-vaidyanathan.jpg",
      funds: "II, III, IV",
      biography: [
        "Rakesh has over 20 years of international business growth experience focused on new market entry, channel management, strategic alliances, and cross-border M&A across the US, Latin America, and India. He brings deep sector exposure in IT services, industrial goods, life sciences, and healthcare, with a strong orientation to digital transformation and go-to-market strategy.",
        "As Founder Partner of The Jai Group, a boutique advisory firm operating across the US-India-LatAm corridor, he leads mandates in M&A advisory, GTM, and market expansion. He is also an active angel investor in Silicon Valley, and founder of the Guindy Angels Network. At Exfinity, he leads the firm's global B2B tech scaling strategy, helping portfolio companies acquire lighthouse customers and scale in the US and Latin American markets.",
      ],
    },
    {
      name: "Shailesh Ghorpade",
      role: "Managing Partner and IC Member",
      region: "India",
      image: "/team/partners/shailesh-ghorpade.jpg",
      funds: "I, II, III",
      biography: [
        "Shailesh Ghorpade is a founding partner of Exfinity Ventures and brings over two decades of experience spanning venture capital, private equity and technology entrepreneurship. Prior to co-founding Exfinity, he was Managing Director at Emergent Ventures India, an early-stage technology fund, where he led investments across enterprise software, semiconductors and embedded systems. Before that, he held senior roles in engineering and product management at technology companies in the US and India.",
        "At Exfinity, Shailesh was instrumental in shaping the fund's deep-tech investment thesis and championed several investments across the portfolio over three funds. He now transitions into a semi-retirement role, continuing to contribute to the firm as an advisor and Investment Committee member — bringing his deep technical expertise and institutional knowledge to bear on investment decisions and portfolio strategy.",
      ],
    },
    {
      name: "Deepak Aggarwal",
      role: "CFO",
      region: "Silicon Valley & India",
      image: "/team/partners/deepak-aggarwal.jpg",
      funds: "I, II, III, IV",
      biography: [
        "Deepak is a Rank holder Chartered Accountant & CMA with over 20 years of experience in the field of finance & compliance.",
        "He was the CFO, CGI India & also a Member of EXCO at RBS TS, India.",
        "Deepak has been awarded as one of the TOP#50 best finance leaders in 2021 by White Page International.",
        "He has served as the Business Finance Head at HCL Tech.",
      ],
    },
  ],
  founders: [
    {
      name: "Deepak Ghaisas",
      role: "Co-founder & Advisor",
      region: "India",
      image: "/team/founders/deepak-ghaisas.jpg",
      biography: [
        "Deepak is the former CEO & CFO of I-flex Solutions Ltd. He headed India operations from 1993 to 2008 and scaled the business from inception to $375m. Deepak is a fellow of ICAI, ICWA and FCS and has more than 29 years of experience in the software industry.",
        "Deepak has served as an Executive Member of the NASSCOM Executive Council; a member of the Committee of the Indian Institute of Bankers constituted to draft the curriculum for the Information System Audit course for bankers; and a member of the Reserve Bank of India's Internet Banking Committee, which formulated guidelines on internet banking and security in India.",
      ],
    },
    {
      name: "Mohandas Pai TV",
      role: "Co-founder & Advisor",
      region: "India",
      image: "/team/founders/mohandas-pai.jpg",
      biography: [
        "Mohandas Pai is the former CFO and Board Member of Infosys Ltd. Infosys is a global IT services company listed on the Indian and US stock exchanges. As part of the Infosys leadership team, he was instrumental in scaling the company from $5m to $3.5b over 15 years. Mohan was the first Indian CFO to list a company, Infosys, on the NASDAQ.",
        "Mohan is Chairman of Manipal Global Education Services, a global education and healthcare conglomerate based in India. He is also Chairman of Aarin Capital, a family office focused on funding innovative business models in India's consumer and education sectors.",
        "He was honoured with the Padma Shri award in 2015 in the Trade and Industry category.",
      ],
    },
  ],
  investmentTeam: [
    {
      name: "Abhijith Menon",
      role: "IR & Operations Analyst",
      region: "India",
      image: "/team/investment/abhijith-menon.jpg",
      biography: ["Abhijith Menon brings around three years of experience across M&A, financial analysis, and investor relations in the IT services and technology sector. At Exfinity, he supports fund operations and portfolio companies, drives investor engagement, and leads internal process optimisation, building on prior experience at Happiest Minds where he modelled and evaluated multiple technology M&A transactions end to end."],
    },
    {
      name: "Afreed Faizan",
      role: "Investment Analyst",
      region: "India",
      image: "/team/investment/afreed-faizan.jpg",
      biography: [
        "Afreed is an Aerospace Engineering graduate from RV College of Engineering, Bangalore, currently focused on investments across DeepTech, AI, and SaaS. Prior to Exfinity, he worked with Golden Sparrow VC and First Cheque (IndiaQuotient’s pre-seed fund), where he evaluated emerging technology startups and supported investments across DeepTech and AI-native software startups. He also worked at the Indian Institute of Science (IISc), Bangalore, where he led research initiatives in Urban Air Mobility and eVTOL systems, at Stratagen Defence on next-generation defence technologies, and at Neuralzome Cybernetics on autonomous robotics and AI systems.",
        "In his free time, he enjoys playing Counter-Strike 2 and competitive Chess Blitz.",
      ],
    },
    {
      name: "Arundhati Menon",
      role: "AVP Investments",
      region: "India",
      image: "/team/investment/arundhati-menon.jpg",
      biography: ["Arundhati brings end-to-end investment experience across sourcing, diligence, and portfolio management, and has contributed to Exfinity's fundraising efforts for Fund 4. She has been involved across the deal lifecycle: from thesis-driven origination and technical-commercial due diligence through to post-investment governance and portfolio support. Prior to Exfinity, she worked at Zinnov, a global management consulting and research firm specialising in technology and innovation. She holds an MBA from INSEAD, and rejoined Exfinity in 2025 following the completion of her postgraduate studies."],
    },
    {
      name: "Prachi Singh",
      role: "VP Operations",
      region: "India",
      image: "/team/investment/prachi-singh.jpg",
      biography: ["Bringing startup-side experience in fundraising, P&L ownership and GTM, Prachi has supported a 37 million dollar Series C round, built a 3 million dollar ARR business unit in Singapore within 12 months, and driven scale and transaction outcomes at BabyChakra ahead of its 15 million dollar-plus merger with MyGlamm — experience she now applies to driving VC portfolio value-creation and fund operations."],
    },
    {
      name: "Sunith Mandala",
      role: "Principal",
      region: "India",
      image: "/team/investment/sunith-mandala.jpg",
      biography: ["Sunith brings over seven years of combined venture capital, investment banking, and semiconductor engineering experience, investing across DeepTech, SaaS, AI, and semiconductors with a particular focus on category-defining companies. At Exfinity, he closely works with partners on key portfolio companies especially on the deep tech side, facilitates the end-to-end investment to exit workflow and served as a board member for Kinara India subsidiary. Sunith has also played a key role in three cross-border strategic acquisitions from leading players such as NXP Semiconductors (Europe), IKEA (Europe) and acts as the transactions expert within the team. Prior to Exfinity, he has transaction experience from Avendus (investment banking) and technical grounding from Intel (semiconductor engineering)."],
    },
  ],
  tacTeam: [
    {
      name: "Balaji Kanigicherla",
      role: "TAC Member",
      region: "India",
      image: "/team/tac/balaji.png",
      biography: [
        "Balaji Kanigicherla is a seasoned semiconductor technology and engineering leader with nearly three decades of experience spanning chip architecture, product development and business management. He most recently served as Vice President, Head of Engineering and CTO at Renesas Electronics, where he led global engineering initiatives and drove innovation across semiconductor technologies.",
        "Prior to Renesas, Balaji was a Corporate Vice President & General Manager at Intel and the Founder & CEO of INEDA Systems, where he developed innovative semiconductor solutions and industry-first product architectures. His experience spans data centers, automotive, embedded systems, IoT, networking and communications. Balaji holds 17 U.S. patents in IP, SoC and system architectures and an M.S. in Electrical Engineering from Arizona State University.",
      ],
    },
    {
      name: "Prabhu Antony",
      role: "Venture Partner",
      region: "USA",
      image: "/team/partners/prabhu-antony.jpg",
      biography: [
        "Prabhu Antony is an accomplished investor and business leader with extensive experience across investment management, M&A, capital markets and strategic advisory. He is the Founder & CIO of Scieniti and a Venture Partner at Exfinity Ventures, with a focus on technology, innovation and growth-stage businesses.",
        "Over the course of his career, Prabhu has been involved in more than $10 billion of M&A, capital raises, public listings and strategic transactions across global markets. He has advised businesses and investors across multiple geographies and sectors, bringing deep expertise in cross-border transactions, capital formation and value creation.",
        "Prabhu is an alumnus of the Wharton School of the University of Pennsylvania and Anna University.",
      ],
    },
    {
      name: "Rahul Sasi",
      role: "TAC Member",
      region: "India",
      image: "/team/tac/rahul-sasi.png",
      biography: [
        "Rahul Sasi is a prominent cybersecurity entrepreneur and technology leader, and the Founder & CEO of CloudSEK, an AI-powered predictive cybersecurity platform. He founded CloudSEK in 2015 with the vision of using AI and machine learning to identify and mitigate cyber threats before they escalate.",
        "Rahul began his cybersecurity journey through independent research and the open-source security community, later working with iSIGHT Partners and Citrix. He is a recognized security researcher and has spoken at leading cybersecurity conferences globally. He has also contributed to policy discussions on digital security, including serving on an expert panel constituted by the Reserve Bank of India. Under his leadership, CloudSEK has grown into a global cybersecurity company serving hundreds of enterprises across sectors.",
      ],
    },
    {
      name: "Vikas Sharma",
      role: "TAC Member",
      region: "India",
      image: "/team/tac/vikas-sharma.png",
      biography: [
        "Vikas Sharma is a seasoned financial services executive and investment banking leader with over 25 years of experience across Asia. He served as Senior Managing Director and Executive Chairman of Nomura India, having previously led Nomura's Asia ex-Japan business. He joined Nomura in 1999 and played a pivotal role in establishing and building the firm's India franchise from 2007 onwards.",
        "As Head of Asia ex-Japan, Vikas was responsible for driving Nomura's business strategy across the region, with deep experience in investment banking and the Technology, Media & Telecom (TMT) sectors. He has advised businesses and institutions across Asia and brings extensive expertise in capital markets, strategic transactions and cross-border opportunities. Vikas is an alumnus of Manipal Institute of Technology and holds an MBA from the Asian Institute of Management, Manila.",
      ],
    },
  ],
};
