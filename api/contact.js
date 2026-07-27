// Vercel Serverless Function — api/contact.js
// Deploy on Vercel and set MONGODB_URI in your Vercel project environment variables.
// Each card/scheme/service stores submissions in its own MongoDB collection.

import { MongoClient } from "mongodb";

let cachedClient = null;

import dns from "dns";

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (_) {}

async function getClient() {
  if (cachedClient) return cachedClient;
  const uri = process.env.LEADS_MONGODB_URI || process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

// ─── Collection Name Mapping ─────────────────────────────────────────────────
const SERVICE_COLLECTION_MAP = {
  // ── Loans ──────────────────────────────────────────────
  "Business Loan":             "leads_business_loan",
  "Salaried Personal Loan":    "leads_salaried_personal_loan",
  "Home Loan":                 "leads_home_loan",
  "Loan Against Property":     "leads_loan_against_property",
  "Education Loan":            "leads_education_loan",
  "Machinery Loan":            "leads_machinery_loan",

  // ── Government Schemes ─────────────────────────────────
  "PMEGP":                     "leads_pmegp",
  "CGTMSE":                    "leads_cgtmse",
  "MUDRA LOAN":                "leads_mudra_loan",
  "STAND-UP INDIA":            "leads_stand_up_india",
  "STARTUP INDIA":             "leads_startup_india",
  "PM-FME":                    "leads_pm_fme",

  // ── Services — Business Registration ───────────────────
  "Business Registration":     "leads_service_business_registration",
  "Private Limited Company":   "leads_service_pvt_ltd_company",
  "One Person Company":        "leads_service_opc",
  "LLP Registration":          "leads_service_llp_registration",
  "Section 8 / NGO":           "leads_service_section8_ngo",

  // ── Services — Certifications ───────────────────────────
  "Certifications":            "leads_service_certifications",
  "ISO Certification":         "leads_service_iso_certification",
  "FSSAI License":             "leads_service_fssai_license",
  "GeM / Import-Export":       "leads_service_gem_import_export",
  "Udyam Registration":        "leads_service_udyam_registration",
  "Startup India":             "leads_service_startup_india",

  // ── Services — Grants & Funding ─────────────────────────
  "Grants & Funding":          "leads_service_grants_funding",
  "PMEGP Grant":               "leads_service_pmegp_grant",
  "CGTMSE Guarantee":          "leads_service_cgtmse_guarantee",
  "Mudra Loan":                "leads_service_mudra_loan",
  "Stand-Up India":            "leads_service_stand_up_india",
  "Startup India Seed Fund":   "leads_service_startup_seed_fund",

  // ── Services — Business Finance ─────────────────────────
  "Business Finance":          "leads_service_business_finance",
  "Working Capital Loan":      "leads_service_working_capital_loan",
  "Term Loan":                 "leads_service_term_loan",
  "Venture Capital":           "leads_service_venture_capital",
  "MSME Financing":            "leads_service_msme_financing",

  // ── Services — Digital Services ─────────────────────────
  "Digital Services":          "leads_service_digital_services",
  "Website Development":       "leads_service_website_development",
  "SEO & Digital Marketing":   "leads_service_seo_digital_marketing",
  "CRM Solutions":             "leads_service_crm_solutions",
  "Social Media Management":   "leads_service_social_media_mgmt",

  // ── Services — Compliance ───────────────────────────────
  "Compliance":                "leads_service_compliance",
  "ROC Compliance":            "leads_service_roc_compliance",
  "GST Filing":                "leads_service_gst_filing",
  "Income Tax Returns":        "leads_service_income_tax_returns",
  "Audit Support":             "leads_service_audit_support",

  // ── Services — Legal & Protection ───────────────────────
  "Legal & Protection":        "leads_service_legal_protection",
  "Trademark Registration":    "leads_service_trademark_registration",
  "Patent Filing":             "leads_service_patent_filing",
  "Copyright Protection":      "leads_service_copyright_protection",
  "Legal Compliance":          "leads_service_legal_compliance",
};

function getCollectionName(service) {
  if (service && SERVICE_COLLECTION_MAP[service]) {
    return SERVICE_COLLECTION_MAP[service];
  }
  if (service) {
    const sanitized = service
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return `leads_${sanitized}`;
  }
  return "leads_general";
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ status: "ok" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  const { name, phone, email, service, message, source } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: "Name and phone are required." });
  }

  try {
    const client = await getClient();
    const db = client.db();
    const collectionName = getCollectionName(service);
    const collection = db.collection(collectionName);

    const doc = {
      name: name.trim(),
      phone: phone.trim(),
      email: (email || "").trim().toLowerCase(),
      service: service || "",
      message: message || "",
      source: source || "website",
      status: "new",
      ipAddress: req.headers["x-forwarded-for"] || "",
      createdAt: new Date(),
    };

    const result = await collection.insertOne(doc);

    console.log(`📨 New lead → collection: "${collectionName}" | ${name} (${phone}) — ${service || "General"}`);

    return res.status(201).json({
      success: true,
      message: "Thank you! Our expert will call you within 24 hours.",
      id: result.insertedId,
      collection: collectionName,
    });
  } catch (err) {
    console.error("API /contact error:", err.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
}
