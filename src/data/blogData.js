// src/data/blogData.js
// Comprehensive SEO knowledge base & blog articles for ArthoVista

export const categories = [
  "All",
  "Government Schemes",
  "Business Finance",
  "Business Registration",
  "Legal & IP Protection",
  "Certifications & Compliance",
  "Startup Funding",
  "Secured Loans",
  "Personal & Education Loans",
  "Digital Marketing & Growth",
];

export const blogPosts = [
  {
    id: 1,
    slug: "iso-certification-india",
    title: "ISO Certification in India: Types, Process, Documents, Cost & Benefits",
    category: "Certifications & Compliance",
    readTime: "8 min read",
    date: "Aug 21, 2026",
    author: "ArthoVista Advisory Team",
    featured: true,
    excerpt: "A structured guide to choosing the right ISO standard, understanding the certification journey, avoiding common mistakes, and knowing the true cost factors in India.",
    metaDescription: "Complete guide to ISO Certification in India. Explore ISO 9001, 14001, 27001, 45001, 22000, 50001, 21001, 8-step audit process, document checklist, cost breakdown, and FAQs.",
    keywords: ["ISO certification in India", "ISO 9001 quality management", "ISO 27001 information security", "ISO certification cost India", "ISO audit process"],
    tableOfContents: [
      { id: "what-is-iso", label: "What Is ISO Certification?" },
      { id: "which-iso", label: "Which ISO Certification Is Right for You?" },
      { id: "who-can-apply", label: "Who Can Apply?" },
      { id: "documents-required", label: "Documents Required" },
      { id: "process", label: "Step-by-Step Certification Process" },
      { id: "cost", label: "How Much Does It Cost?" },
      { id: "timeline", label: "How Long Does It Take?" },
      { id: "benefits", label: "Benefits of ISO Certification" },
      { id: "mandatory", label: "Is ISO Certification Mandatory?" },
      { id: "mistakes", label: "Common Mistakes to Avoid" },
      { id: "faqs", label: "Frequently Asked Questions" },
    ],
    sections: [
      {
        id: "intro",
        type: "lead",
        content: `When a business searches for an "ISO certificate," the first question should not be, "How quickly can I get one?" The more important question is: Which ISO standard is relevant to my business, and what does certification actually require? ISO certification can help an organisation demonstrate that its management system has been independently assessed against the requirements of a particular international standard. However, ISO certification is not a single government registration, and there is no universal ISO certificate that applies to every business.`,
      },
      {
        id: "what-is-iso",
        title: "What Is ISO Certification?",
        type: "content",
        content: `ISO standards are developed by the International Organization for Standardization (ISO). Different standards address different management-system requirements.

An important distinction is that ISO itself does not issue certificates or certify organisations. Certification is performed by independent certification bodies. Accreditation is a separate process through which an accreditation body formally recognises the competence of a certification body against applicable requirements.

Therefore, businesses should distinguish between:
• **ISO standard** – the requirements or guidance being followed
• **Certification body** – the independent organisation that conducts the certification audit and issues the certificate
• **Accreditation body** – an organisation that assesses and accredits certification bodies within the applicable accreditation framework (such as NABCB in India, UKAS, JAS-ANZ, etc.)`,
      },
      {
        id: "which-iso",
        title: "Which ISO Certification Is Right for Your Business?",
        type: "table",
        description: "There is no single 'best ISO certification.' The appropriate standard depends on your business activity, risks and objectives.",
        tableData: {
          headers: ["ISO Standard", "Main Focus", "Commonly Relevant To"],
          rows: [
            ["ISO 9001", "Quality Management System (QMS)", "Most sectors (Manufacturing, Trading, Services)"],
            ["ISO 14001", "Environmental Management System (EMS)", "Manufacturing, industrial, and environmentally focused businesses"],
            ["ISO 45001", "Occupational Health and Safety (OH&S)", "Construction, manufacturing, and high-risk workplaces"],
            ["ISO 22000", "Food Safety Management System (FSMS)", "Food processors, cloud kitchens, caterers, packaging"],
            ["ISO/IEC 27001", "Information Security Management (ISMS)", "IT, SaaS, fintech, technology, and data-driven organisations"],
            ["ISO 50001", "Energy Management System", "Organisations seeking structured energy-conservation systems"],
            ["ISO 21001", "Management Systems for Educational Organizations", "Schools, universities, training institutes, EdTech"],
          ],
        },
      },
      {
        id: "who-can-apply",
        title: "Who Can Apply for ISO Certification?",
        type: "list",
        content: "ISO management-system certification is open to organizations of all scales and legal structures:",
        items: [
          "Startups and early-stage innovators",
          "MSMEs and proprietary firms",
          "Private Limited Companies and LLPs",
          "Manufacturing and industrial plants",
          "IT, software, and SaaS providers",
          "Consulting and professional service firms",
          "Educational institutions and healthcare organizations",
          "Exporters and enterprises participating in government tenders or B2B procurement",
        ],
      },
      {
        id: "documents-required",
        title: "Documents Required for ISO Certification",
        type: "documents",
        content: "There is no single document list applicable to every standard. Requirements are divided into Business and Management-System records:",
        businessDocs: [
          "Business Registration proof (Certificate of Incorporation, Partnership Deed, Udyam Registration, or GST Certificate)",
          "PAN and applicable tax-registration details",
          "Address and location proof of operating units",
          "Company profile and description of business activities",
          "Employee / organizational structure details",
          "Proposed certification scope and site boundaries",
        ],
        systemDocs: [
          "Quality / Information Security / Environmental Policy",
          "Measurable quality & operational objectives",
          "Standard Operating Procedures (SOPs) and workflow process maps",
          "Risk assessments and mitigation strategies",
          "Internal audit reports and non-conformance records",
          "Management Review Meeting (MRM) minutes and corrective-action records",
        ],
      },
      {
        id: "process",
        title: "Step-by-Step ISO Certification Process in India",
        type: "steps",
        steps: [
          { step: "1", title: "Identify Applicable ISO Standard", desc: "Select the standard that genuinely addresses your operational requirements and market expectations." },
          { step: "2", title: "Define Certification Scope", desc: "Clearly define which business activities, products, services, and locations will be covered." },
          { step: "3", title: "Conduct a Gap Assessment", desc: "Compare existing processes against the ISO standard clauses to pinpoint compliance gaps." },
          { step: "4", title: "Develop & Implement the Management System", desc: "Draft required policies, procedures, SOPs, and ensure staff follow them in day-to-day operations." },
          { step: "5", title: "Internal Audit & Management Review", desc: "Conduct internal verification to identify non-conformities and implement corrective actions." },
          { step: "6", title: "Certification Audit (Stage 1 & Stage 2)", desc: "Independent certification body conducts Stage 1 (readiness review) and Stage 2 (implementation assessment)." },
          { step: "7", title: "Corrective Action & Closure", desc: "Submit root-cause analysis and corrective evidence for any audit observations or minor non-conformities." },
          { step: "8", title: "Certificate Issuance & Surveillance", desc: "Upon approval, the ISO certificate is issued (valid for 3 years, subject to annual surveillance audits)." },
        ],
      },
      {
        id: "cost",
        title: "How Much Does ISO Certification Cost in India?",
        type: "table",
        description: "Publishing a single universal 'ISO certificate price' is misleading. The total investment depends on employee headcount, locations, operational complexity, and accreditation body.",
        tableData: {
          headers: ["Cost Component", "What It Covers"],
          rows: [
            ["Gap Assessment", "Initial audit to benchmark existing processes against ISO standards"],
            ["Consultancy & Documentation", "Drafting policies, procedures, manuals, and record formats"],
            ["Implementation Support", "Employee training and process alignment assistance"],
            ["Internal Audit Support", "Pre-audit verification and internal auditor assistance"],
            ["Certification Body Audit Fee", "External Stage 1 & Stage 2 assessment charges by accredited registrar"],
            ["Surveillance Audits", "Annual ongoing maintenance audit charges for years 2 and 3"],
            ["Travel & Incidental Expenses", "On-site auditor logistics (for multi-location/manufacturing audits)"],
          ],
        },
      },
      {
        id: "benefits",
        title: "Key Benefits of Getting ISO Certified",
        type: "cards",
        cards: [
          { title: "Better Process Management", desc: "Streamline workflows, reduce operational errors, and establish standardized ways of working." },
          { title: "Tender & B2B Eligibility", desc: "Meet mandatory qualification requirements for corporate procurement and government tenders." },
          { title: "Customer Trust & Credibility", desc: "Demonstrate verified adherence to international quality and data safety standards." },
          { title: "Global Market Access", desc: "Gain an internationally recognized benchmark essential for exporting goods and cross-border services." },
        ],
      },
      {
        id: "mistakes",
        title: "Common Mistakes Businesses Make",
        type: "callout",
        calloutType: "warning",
        items: [
          "Choosing an ISO standard without understanding its relevance to business operations.",
          "Selecting a certification provider solely based on the cheapest quote without verifying accreditation.",
          "Treating ISO purely as a paper exercise without actually implementing the procedures.",
          "Ignoring the defined certification scope, leading to invalidated tender submissions.",
          "Failing to conduct regular internal audits and annual surveillance audits, resulting in certificate suspension.",
        ],
      },
    ],
    faqs: [
      { q: "What is an ISO certificate?", a: "An ISO certificate is an official document issued by an accredited certification body confirming that an organization's management system complies with a specific ISO standard." },
      { q: "Which ISO certification is best for a small business?", a: "ISO 9001 (Quality Management) is the most widely adopted foundational standard for MSMEs, while tech startups typically prioritize ISO 27001 (Information Security)." },
      { q: "Is ISO certification mandatory in India?", a: "ISO certification is generally voluntary unless specifically mandated by a customer contract, supply-chain partner, tender criteria, or regulatory directive." },
      { q: "How long is an ISO certificate valid?", a: "ISO management-system certificates are typically valid for 3 years, provided the organization successfully passes mandatory annual surveillance audits." },
      { q: "Can a startup get ISO certified?", a: "Yes. Early-stage startups can achieve ISO certification as long as they have documented and implemented the relevant management system within their defined scope." },
      { q: "Does ISO certification guarantee government tender approval?", a: "No. ISO certification satisfies mandatory eligibility clauses in tenders, but selection depends on technical and financial evaluation." },
    ],
  },
  {
    id: 2,
    slug: "pmfme-scheme-2026",
    title: "PMFME Scheme 2026: Eligibility, 35% Subsidy, Loan & Application Process",
    category: "Government Schemes",
    readTime: "9 min read",
    date: "Aug 21, 2026",
    author: "ArthoVista Advisory Team",
    featured: true,
    excerpt: "Explore the PMFME scheme in 2026: 35% credit-linked capital subsidy up to ₹10 lakh, ODOP framework, bank loan integration, and latest extension updates.",
    metaDescription: "Complete guide to PMFME Scheme 2026. Learn about 35% credit-linked capital subsidy up to ₹10 lakh, One District One Product (ODOP), eligibility, DPR preparation, and FoSCoS links.",
    keywords: ["PMFME scheme 2026", "PMFME subsidy 35 percent", "food processing subsidy India", "ODOP food processing loan", "PMFME application process"],
    tableOfContents: [
      { id: "what-is-pmfme", label: "What Is the PMFME Scheme?" },
      { id: "extension-2026", label: "2026 Extension & Timeline Update" },
      { id: "subsidy-structure", label: "What Is the PMFME Subsidy?" },
      { id: "support-components", label: "All Support Components & Ceilings" },
      { id: "odop", label: "Understanding One District One Product (ODOP)" },
      { id: "eligible-businesses", label: "What Businesses Can Apply?" },
      { id: "documents", label: "Documents Required" },
      { id: "application-process", label: "Step-by-Step Application Process" },
      { id: "mistakes", label: "Common Applicant Mistakes" },
      { id: "faqs", label: "Frequently Asked Questions" },
    ],
    sections: [
      {
        id: "intro",
        type: "lead",
        content: `If you run a small food-processing business or are planning to establish one, the cost of machinery, processing equipment, packaging, infrastructure and working capital can become a significant financial challenge. The Pradhan Mantri Formalisation of Micro Food Processing Enterprises (PMFME) Scheme was introduced by the Ministry of Food Processing Industries (MoFPI) to support micro food-processing enterprises through financial assistance, capacity building, technology support, branding, marketing and formalisation.`,
      },
      {
        id: "extension-2026",
        title: "Important 2026 Timeline & Extension Update",
        type: "callout",
        calloutType: "info",
        items: [
          "The PMFME Scheme was originally designed for 2020-21 to 2024-25, and has undergone subsequent extensions.",
          "The official PMFME May 2026 newsletter confirms that the scheme has been temporarily extended until 30 September 2026 by the Department of Expenditure.",
          "Applicants should verify the active state-level portal application windows before committing project capital.",
        ],
      },
      {
        id: "subsidy-structure",
        title: "What Is the PMFME Subsidy? (35% Credit-Linked Capital Subsidy)",
        type: "table",
        description: "For eligible individual micro food-processing units, PMFME provides a credit-linked capital subsidy of 35% of eligible project cost, capped at ₹10 lakh per unit. The beneficiary must contribute at least 10%, with the balance financed via bank loan.",
        tableData: {
          headers: ["Particulars", "Project Cost Example (₹20 Lakh)"],
          rows: [
            ["Eligible Project Cost", "₹20,00,000"],
            ["Promoter Contribution (Min 10%)", "₹2,00,000"],
            ["Bank Loan Component", "₹18,00,000"],
            ["Credit-Linked Subsidy Rate", "35%"],
            ["Potential Government Subsidy", "₹7,00,000 (Adjusted against loan)"],
          ],
        },
      },
      {
        id: "support-components",
        title: "PMFME Support Components & Maximum Benefits",
        type: "table",
        tableData: {
          headers: ["No.", "Support Component", "Maximum Benefit / Ceiling"],
          rows: [
            ["1", "Credit-Linked Capital Subsidy (Individual Unit)", "35% of eligible project cost, up to ₹10 lakh"],
            ["2", "Seed Capital for SHG Members", "₹40,000 per member for working capital & small tools"],
            ["3", "Common Infrastructure Projects (FPOs/SHGs/Coops)", "35% credit-linked subsidy, up to ₹3 crore"],
            ["4", "Branding & Marketing Support", "Up to 50% support for ODOP products and clusters"],
            ["5", "Training & Capacity Building", "Entrepreneurship, FSSAI compliance, packaging & technical training"],
          ],
        },
      },
      {
        id: "odop",
        title: "What Is ODOP in PMFME?",
        type: "content",
        content: `ODOP stands for **One District One Product**. Under this framework, each district across India is mapped to specific agricultural and food products where it holds distinct agricultural or commercial advantages.

The ODOP approach seeks to promote:
• Local processing and value addition
• Common infrastructure (sorting, grading, cold storage)
• Standardized packaging, branding, and wider market linkages
• Efficient supply-chain clustering

*Note: While ODOP units receive priority assistance, existing non-ODOP units can also receive support for technology upgradation.*`,
      },
      {
        id: "eligible-businesses",
        title: "Eligible Food Processing Activities",
        type: "list",
        content: "PMFME covers a diverse array of value-addition food processing ventures:",
        items: [
          "Fruit and vegetable processing (juices, jams, dehydration, pulping)",
          "Grains, pulses, and cereal milling / processing",
          "Spices grinding, blending, and packaging",
          "Dairy processing (ghee, paneer, curd, cheese units)",
          "Oilseed extraction and cold-pressed edible oils",
          "Honey processing and packaging",
          "Millet-based snacks, flour, and ready-to-cook products",
          "Bakery, confectioneries, and regional ready-to-eat specialties",
        ],
      },
      {
        id: "documents",
        title: "Documents Required for PMFME Application",
        type: "documents",
        businessDocs: [
          "Aadhaar card and PAN card of applicant / promoters",
          "Address proof and photograph",
          "Bank account statements for the last 6 months",
          "Business constitution documents (Udyam Registration, Partnership Deed, MOA/AOA)",
          "Proof of business premises ownership or lease agreement",
          "GST & FSSAI registration (or undertaking to obtain upon setup)",
        ],
        systemDocs: [
          "Detailed Project Report (DPR) detailing cost of project and capacity",
          "Machinery and processing equipment quotations from verified suppliers",
          "Projected financial statements (P&L, Balance Sheet, DSCR calculations)",
          "ODOP alignment declaration",
        ],
      },
      {
        id: "application-process",
        title: "How to Apply for PMFME Scheme (8-Step Process)",
        type: "steps",
        steps: [
          { step: "1", title: "Identify Activity & ODOP", desc: "Select the food processing product and verify its alignment with district ODOP guidelines." },
          { step: "2", title: "Prepare Project & DPR", desc: "Calculate total machinery cost, working capital, production capacity, and cash-flow projections." },
          { step: "3", title: "Gather KYC & Quotations", desc: "Collect supplier quotations, site ownership/rental agreements, and identity documents." },
          { step: "4", title: "Submit Online via MoFPI Portal", desc: "Register and file the application on the official PMFME online portal." },
          { step: "5", title: "District Level Scrutiny", desc: "District Resource Person (DRP) and District Level Committee (DLC) review application completeness." },
          { step: "6", title: "Bank Appraisal & Sanction", desc: "Participating bank conducts commercial credit appraisal and issues loan sanction letter." },
          { step: "7", title: "Unit Setup & Disbursement", desc: "Bank disburses loan in stages; entrepreneur procures machinery and installs equipment." },
          { step: "8", title: "Subsidy Claim & Adjustment", desc: "Bank claims the 35% margin money subsidy, which is kept in a subsidy reserve account and adjusted as per MoFPI norms." },
        ],
      },
      {
        id: "mistakes",
        title: "Common PMFME Application Pitfalls",
        type: "callout",
        calloutType: "warning",
        items: [
          "Treating the PMFME subsidy as an upfront cash grant instead of a credit-linked bank loan.",
          "Submitting unrealistic project cost estimates without machinery supplier quotations.",
          "Confusing the ₹10 lakh individual unit ceiling with the ₹3 crore common infrastructure ceiling.",
          "Ignoring bank loan appraisal requirements such as credit history and debt-service coverage ratio (DSCR).",
        ],
      },
    ],
    faqs: [
      { q: "What is the PMFME Scheme?", a: "PMFME is a flagship scheme of the Ministry of Food Processing Industries supporting micro food-processing units with 35% credit-linked capital subsidy, training, and branding support." },
      { q: "How much subsidy is provided to an individual unit?", a: "Eligible individual units receive a 35% credit-linked capital subsidy on eligible project costs, subject to a maximum ceiling of ₹10 lakh." },
      { q: "Is PMFME an upfront grant or a loan?", a: "PMFME is a credit-linked subsidy tied to a mandatory bank loan. The subsidy is credited to a Subsidy Reserve Fund account with the lending bank." },
      { q: "Can a new food-processing business apply?", a: "Yes. Both newly established greenfield units and existing units seeking technology upgradation are eligible under the PMFME framework." },
      { q: "Is an FSSAI licence compulsory?", a: "Yes, all food processing units must comply with food safety standards and obtain the required FSSAI Registration or State/Central Licence." },
    ],
  },
  {
    id: 3,
    slug: "pmegp-loan-scheme",
    title: "PMEGP Loan: Eligibility, Subsidy, Documents, Project Cost & Application Process",
    category: "Government Schemes",
    readTime: "9 min read",
    date: "Aug 21, 2026",
    author: "ArthoVista Advisory Team",
    featured: true,
    excerpt: "Everything you need to know about Prime Minister's Employment Generation Programme (PMEGP). Margin money subsidy from 15% to 35%, project limits up to ₹50 lakh, and 2nd loan upgradation.",
    metaDescription: "Comprehensive guide to PMEGP Loan scheme. Discover 15%-35% margin money subsidy, ₹50L manufacturing limit, ₹20L service limit, DPR requirements, KVIC e-portal filing, and 2nd loan rules.",
    keywords: ["PMEGP loan scheme", "PMEGP subsidy percentage", "KVIC margin money loan", "PMEGP project cost limit", "PMEGP DPR preparation"],
    tableOfContents: [
      { id: "what-is-pmegp", label: "What Is PMEGP?" },
      { id: "project-limits", label: "Project Cost Limits" },
      { id: "subsidy-rates", label: "Subsidy Percentages & Contribution" },
      { id: "eligibility", label: "Who Is Eligible?" },
      { id: "permitted-businesses", label: "Permitted & Restricted Activities" },
      { id: "documents", label: "Documents Required" },
      { id: "application-process", label: "Step-by-Step Application Process" },
      { id: "second-loan", label: "2nd Loan for Upgradation (Up to ₹1 Cr)" },
      { id: "mistakes", label: "Common Mistakes to Avoid" },
      { id: "faqs", label: "Frequently Asked Questions" },
    ],
    sections: [
      {
        id: "intro",
        type: "lead",
        content: "Starting a small business often requires more capital than an entrepreneur can arrange personally.For eligible applicants, the Prime Minister's Employment Generation Programme (PMEGP) provides a structured route to finance a new micro-enterprise through a combination of beneficiary contribution, bank finance and government margin-money subsidy. PMEGP is implemented nationally through the Khadi and Village Industries Commission (KVIC), along with State KVIBs, District Industries Centres (DICs) and participating banks.",
      },
      {
        id: "project-limits",
        title: "PMEGP Project Cost Limits (New Enterprises)",
        type: "table",
        tableData: {
          headers: ["Sector", "Maximum Admissible Project Cost for Subsidy"],
          rows: [
            ["Manufacturing Sector", "₹50 Lakh"],
            ["Business / Service Sector", "₹20 Lakh"],
          ],
        },
      },
      {
        id: "subsidy-rates",
        title: "PMEGP Margin-Money Subsidy & Beneficiary Contribution",
        type: "table",
        description: "The subsidy rate depends on the applicant's category and the geographic location of the proposed enterprise:",
        tableData: {
          headers: ["Applicant Category", "Beneficiary Own Contribution", "Urban Area Subsidy", "Rural Area Subsidy"],
          rows: [
            ["General Category", "10% of project cost", "15% of project cost", "25% of project cost"],
            ["Special Category (SC, ST, OBC, Women, Minorities, Ex-Servicemen, PwD, Transgender, Hill/NER)", "5% of project cost", "25% of project cost", "35% of project cost"],
          ],
        },
      },
      {
        id: "eligibility",
        title: "PMEGP Eligibility Criteria",
        type: "list",
        items: [
          "Individual must be at least 18 years of age.",
          "No family income ceiling for assistance.",
          "Minimum educational qualification: 8th standard pass for projects costing above ₹10 lakh in manufacturing or above ₹5 lakh in business/service.",
          "Only one person from one family (applicant, spouse, unmarried children) is eligible.",
          "Assistance is available only for new projects (existing units that received prior govt subsidy are ineligible for the new-unit component).",
        ],
      },
      {
        id: "permitted-businesses",
        title: "Permitted & Negative List Activities",
        type: "content",
        content: `PMEGP covers eligible viable micro-enterprises in the non-farm sector.

          *Eligible Sectors:*
          * Agro-based and food processing units
          * Forest-based and organic products
          * Hand-made paper and fiber products
          * Mineral and chemical-based products
          * Engineering and non-conventional energy units
          * Service activities (clinics, labs, salons, transport, catering, IT centres)

          *Specific Trading Permissions:*
          While general trading is restricted, specific retail outlets are permitted: Khadi retail outlets, products procured from KVI institutions, PMEGP/SFURTI cluster products, and retail units in the North Eastern Region, LWE districts, and Andaman & Nicobar.`,
      },
      {
        id: "documents",
        title: "Documents Required for PMEGP Loan",
        type: "documents",
        businessDocs: [
          "Aadhaar card, PAN card, and Passport photographs",
          "Address proof and Caste / Category certificate (for Special Category subsidy)",
          "Educational qualification certificates (8th standard or higher marksheets)",
          "Proposed business premises details (ownership proof or rent agreement)",
          "EDP training certificate (if completed beforehand; can also be completed post-sanction)",
        ],
        systemDocs: [
          "Comprehensive Detailed Project Report (DPR) covering business model, machinery, raw materials, manpower, and cash flows",
          "Itemized machinery and equipment quotations from registered vendors",
          "Working capital calculation and projected repayment schedule",
        ],
      },
      {
        id: "application-process",
        title: "Step-by-Step PMEGP Loan Process",
        type: "steps",
        steps: [
          { step: "1", title: "Define Business & Project Cost", desc: "Structure the capital expenditure and working capital requirements within scheme limits." },
          { step: "2", title: "Prepare Comprehensive DPR", desc: "Draft a bankable project report with realistic sales, expenditure, and repayment projections." },
          { step: "3", title: "Submit Online on KVIC Portal", desc: "File Form on the official PMEGP e-portal (selecting sponsoring agency: KVIC, KVIB, or DIC)." },
          { step: "4", title: "Agency Scrutiny & Forwarding", desc: "The selected agency verifies documents and electronically forwards the application to the chosen financing bank." },
          { step: "5", title: "Bank Credit Appraisal", desc: "The bank evaluates technical feasibility, economic viability, and borrower creditworthiness." },
          { step: "6", title: "Sanction & Promoter Contribution", desc: "Upon approval, the bank issues sanction letter and borrower deposits the 5% or 10% own contribution." },
          { step: "7", title: "EDP Training & Disbursement", desc: "Borrower completes mandatory Entrepreneurship Development Programme (EDP) training, and loan is disbursed." },
          { step: "8", title: "Physical Verification & Subsidy Adjustment", desc: "Udyam Registration is obtained; after physical inspection, the margin money subsidy is locked for 3 years in TDR before final adjustment." },
        ],
      },
      {
        id: "second-loan",
        title: "Second Loan for Upgradation of Existing PMEGP Units",
        type: "cards",
        cards: [
          { title: "Maximum Cost (Manufacturing)", desc: "Up to ₹1.00 Crore for expanding existing manufacturing units." },
          { title: "Maximum Cost (Service)", desc: "Up to ₹25.00 Lakh for expanding existing service enterprises." },
          { title: "Subsidy Rate", desc: "15% for all categories (20% for units located in North Eastern and Hill States)." },
          { title: "Eligibility", desc: "First loan must be fully repaid without defaults, unit must be profitable for past 3 consecutive years, and have Udyam registration." },
        ],
      },
      {
        id: "mistakes",
        title: "Common PMEGP Application Mistakes",
        type: "callout",
        calloutType: "warning",
        items: [
          "Assuming PMEGP is free grant money—it is a credit-linked subsidy that requires disciplined bank loan repayment.",
          "Submitting weak or copied DPRs without realistic sales projections and DSCR calculations.",
          "Applying without valid caste/special category certificates when claiming 25% or 35% subsidy rates.",
          "Failing to deposit the mandatory 5% or 10% beneficiary contribution into the bank account.",
        ],
      },
    ],
    faqs: [
      { q: "What is PMEGP?", a: "PMEGP is a national credit-linked subsidy scheme administered by KVIC to promote self-employment through non-farm micro-enterprises." },
      { q: "What is the maximum subsidy under PMEGP?", a: "The subsidy is up to 35% of eligible project cost for special categories in rural areas, and up to 25% for general categories in rural areas." },
      { q: "Is there any income limit to apply for PMEGP?", a: "No, there is no family income ceiling to apply for setting up a new project under PMEGP." },
      { q: "Can women apply for PMEGP?", a: "Yes, women applicants are classified under the Special Category and are eligible for higher subsidy rates (25% in urban, 35% in rural)." },
      { q: "Does PMEGP guarantee bank loan sanction?", a: "No. Loan sanction is solely at the discretion of the lending bank based on project viability and credit appraisal." },
    ],
  },
  {
    id: 4,
    slug: "machinery-loan-india",
    title: "Machinery Loan in India: Eligibility, Documents, Process & Financing Options",
    category: "Business Finance",
    readTime: "8 min read",
    date: "Aug 21, 2026",
    author: "ArthoVista Advisory Team",
    featured: false,
    excerpt: "Comprehensive guide to machinery and equipment financing in India. SIDBI direct loan schemes, bank assessment factors, interest rates, and document checklists.",
    metaDescription: "Guide to Machinery Loans in India for MSMEs. Learn about equipment financing, SIDBI direct loans, FIT Rank credit assessments, required documents, and interest factors.",
    keywords: ["Machinery loan India", "equipment finance MSME", "SIDBI machinery loan", "industrial equipment loan", "machinery financing process"],
    tableOfContents: [
      { id: "what-is-machinery-loan", label: "What Is a Machinery Loan?" },
      { id: "eligible-sectors", label: "Eligible Sectors & Equipment" },
      { id: "eligibility", label: "Who Can Apply & Assessment Factors" },
      { id: "documents", label: "Documents Required" },
      { id: "process", label: "8-Step Application & Disbursement Process" },
      { id: "costs", label: "Interest Rates & Cost Factors" },
      { id: "benefits", label: "Key Benefits of Machinery Finance" },
      { id: "mistakes", label: "Common Pitfalls to Avoid" },
      { id: "faqs", label: "Frequently Asked Questions" },
    ],
    sections: [
      {
        id: "intro",
        type: "lead",
        content: "Buying new machinery can change the economics of a business.A faster production line can increase capacity, modern equipment can improve quality, and specialised machinery can allow a business to take on work that was previously out of reach.For many MSMEs, paying the entire machinery cost from working capital puts severe pressure on liquidity.A machinery loan spreads that capital expenditure over 3 to 7 years.",
      },
      {
        id: "eligible-sectors",
        title: "Eligible Sectors & Examples of Financed Equipment",
        type: "table",
        tableData: {
          headers: ["Business Sector", "Examples of Eligible Equipment"],
          rows: [
            ["Manufacturing", "Production lines, CNC machines, injection molding, lathes, boilers, cutting tools"],
            ["Food Processing", "Pulping, pasteurizing, packaging, cold storage, automated bottling units"],
            ["Textile & Garment", "Spinning machines, computerized embroidery, automated stitching, laser cutters"],
            ["Construction", "Excavators, cranes, concrete mixers, road compactors, earthmovers"],
            ["Printing & Packaging", "Offset printing presses, digital packaging machines, corrugation plants"],
            ["Healthcare & Diagnostics", "MRI, CT scanners, ultrasound equipment, surgical and ICU tools"],
            ["Engineering & Fabrication", "Laser welding, plasma cutting, hydraulic press brakes, inspection gear"],
          ],
        },
      },
      {
        id: "eligibility",
        title: "Eligibility & Assessment Parameters",
        type: "content",
        content: `Lenders (including Commercial Banks, NBFCs, and SIDBI) evaluate both the borrower's credit standing and the equipment being purchased.

          *Key Assessment Factors:*
          * *Business Vintage:* Typically at least 2 to 3 years of profitable operations (though SIDBI & greenfield schemes have specific windows).
          * *Financial Health:* Turnover stability, EBITDA margins, and positive net cash flows.
          * *Credit Profile & FIT Rank:* Lenders use frameworks like SIDBI's FIT Rank (evaluating GST returns, ITR filings, and banking transaction velocity).
          * *Asset Quality:* OEM reputation, expected operational lifespan, and resale marketability.`,
      },
      {
        id: "documents",
        title: "Documents Required for Machinery Loan",
        type: "documents",
        businessDocs: [
          "Business Registration (Udyam Certificate, Certificate of Incorporation, GST Registration)",
          "PAN cards and Aadhaar of Directors / Partners / Proprietor",
          "Audited Financial Statements (Balance Sheet, P&L, Tax Audit Report) for last 2–3 years",
          "Bank Statements for the primary business account (last 12 months)",
          "Income Tax Returns (ITR) with computation of income",
          "Existing loan sanction letters and repayment track records",
        ],
        systemDocs: [
          "Official Proforma Invoice / Quotation from machine manufacturer or authorized dealer",
          "Technical specifications and expected operational capacity enhancement report",
          "Installation, electrification, and civil foundation cost estimates (where applicable)",
          "Projected financial statements demonstrating additional cash flow generation",
        ],
      },
      {
        id: "process",
        title: "Machinery Loan Workflow: Step-by-Step",
        type: "steps",
        steps: [
          { step: "1", title: "Equipment Finalization", desc: "Select machinery and obtain verified proforma invoice with warranty and delivery terms." },
          { step: "2", title: "Financial Assessment", desc: "Calculate required margin money (usually 15%-25%) and evaluate monthly EMI repayment capacity." },
          { step: "3", title: "Lender Selection", desc: "Compare public banks, private financiers, and SIDBI direct loan schemes." },
          { step: "4", title: "File Submission", desc: "Submit complete business, KYC, financial, and machine technical documentation." },
          { step: "5", title: "Technical & Financial Appraisal", desc: "Lender assesses business viability, supplier credentials, and machines' asset value." },
          { step: "6", title: "Sanction Letter", desc: "Lender issues sanction letter with interest rate, tenure, and hypothecation terms." },
          { step: "7", title: "Margin Deposit & Documentation", desc: "Borrower pays promoter margin, executes loan agreements, and signs hypothecation deed." },
          { step: "8", title: "Direct Supplier Disbursement", desc: "Lender disburses payment directly to the machine OEM/supplier upon inspection." },
        ],
      },
      {
        id: "costs",
        title: "Interest Rates & Cost Factors",
        type: "cards",
        cards: [
          { title: "Interest Rate Structure", desc: "Ranges based on credit rating, business vintage, and collateral security (competitive rates under SIDBI/CGTMSE schemes)." },
          { title: "Processing & Valuation Fees", desc: "Typically 0.5% to 2% of the sanctioned loan amount, plus statutory stamp duties." },
          { title: "Loan Tenure", desc: "Generally 3 to 7 years, often structured with a moratorium covering machine installation and commissioning." },
          { title: "Margin Requirement", desc: "Promoters typically contribute 15% to 25% of the total landed cost of the machine." },
        ],
      },
      {
        id: "mistakes",
        title: "Common Mistakes in Machinery Financing",
        type: "callout",
        calloutType: "warning",
        items: [
          "Ordering machinery or paying non-refundable advances before securing loan sanction.",
          "Ignoring ancillary expenses like customs duty, transit insurance, electrical load increase, and installation.",
          "Overestimating immediate capacity utilization and revenue ramp-up from new equipment.",
          "Choosing unverified second-hand machinery without verifying lender used-equipment financing policies.",
        ],
      },
    ],
    faqs: [
      { q: "Is a machinery loan only for manufacturing companies?", a: "No. Machinery and equipment loans are available for service businesses (hospitals, diagnostic labs, IT infra) as well as manufacturing units." },
      { q: "Can MSMEs get collateral-free machinery loans?", a: "Yes. Under CGTMSE or specific SIDBI schemes, machinery loans can be sanctioned with hypothecation of the purchased asset as primary security." },
      { q: "Can second-hand machinery be financed?", a: "Some lenders finance imported or domestic refurbished equipment subject to residual life certification by a chartered engineer." },
      { q: "How are funds disbursed for a machinery loan?", a: "Lenders almost always disburse funds directly to the equipment manufacturer or authorized dealer against the proforma invoice." },
    ],
  },
];