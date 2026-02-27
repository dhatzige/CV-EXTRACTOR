// ============================================================
// PP Resource Pool Tracker — Schema (matches Excel columns A–Z)
// ============================================================

export interface ResourceEntry {
  resource_id: string;
  full_name: string;
  job_title_role: string;
  email: string;
  phone: string;
  location: string;
  right_to_work: RightToWork | string;
  status: Status;
  available_from: string;
  day_rate_gbp: string;
  rate_flexibility: RateFlexibility | "";
  subject_matter_knowledge: string;
  technical_skills: string;
  systems: string;
  experience_level: ExperienceLevel | string;
  years_experience: number | string;
  source_referral: SourceReferral;
  source_notes: string;
  date_added: string;
  interview_notes: string;
  client_fit_tags: string;
  contract_history: string;
  last_contacted: string;
  next_follow_up: string;
  cv_filename: string;
  notes: string;
}

// Enum values matching Excel dropdown validations exactly
export const STATUS_OPTIONS = [
  "Available",
  "Engaged",
  "On Notice",
  "Unavailable",
  "On Hold",
] as const;
export type Status = (typeof STATUS_OPTIONS)[number];

export const RIGHT_TO_WORK_OPTIONS = [
  "UK Citizen",
  "Settled Status",
  "Pre-Settled",
  "Tier 2 Visa",
  "Requires Sponsorship",
  "EU National",
  "Other",
] as const;
export type RightToWork = (typeof RIGHT_TO_WORK_OPTIONS)[number];

export const RATE_FLEXIBILITY_OPTIONS = [
  "Fixed",
  "Negotiable",
  "Flexible",
  "TBC",
] as const;
export type RateFlexibility = (typeof RATE_FLEXIBILITY_OPTIONS)[number];

export const SOURCE_OPTIONS = [
  "LinkedIn",
  "Referral",
  "Job Board",
  "Direct Application",
  "Network Event",
  "Returning Resource",
  "Agency",
  "CV Upload",
  "Other",
] as const;
export type SourceReferral = (typeof SOURCE_OPTIONS)[number];

export const EXPERIENCE_LEVEL_OPTIONS = [
  "Analyst",
  "Consultant",
  "Senior",
  "Manager",
  "Director",
] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVEL_OPTIONS)[number];

// Column order for export — matches Excel columns A through Z
export const COLUMN_ORDER: (keyof ResourceEntry)[] = [
  "resource_id",
  "full_name",
  "job_title_role",
  "email",
  "phone",
  "location",
  "right_to_work",
  "status",
  "available_from",
  "day_rate_gbp",
  "rate_flexibility",
  "subject_matter_knowledge",
  "technical_skills",
  "systems",
  "experience_level",
  "years_experience",
  "source_referral",
  "source_notes",
  "date_added",
  "interview_notes",
  "client_fit_tags",
  "contract_history",
  "last_contacted",
  "next_follow_up",
  "cv_filename",
  "notes",
];

// Display labels matching Excel header row
export const COLUMN_LABELS: Record<keyof ResourceEntry, string> = {
  resource_id: "Resource ID",
  full_name: "Full Name",
  job_title_role: "Job Title / Role",
  email: "Email",
  phone: "Phone",
  location: "Location",
  right_to_work: "Right to Work",
  status: "Status",
  available_from: "Available From",
  day_rate_gbp: "Day Rate (\u00A3)",
  rate_flexibility: "Rate Flexibility",
  subject_matter_knowledge: "Subject Matter Knowledge",
  technical_skills: "Technical Skills",
  systems: "Systems",
  experience_level: "Experience Level",
  years_experience: "Years Experience",
  source_referral: "Source / Referral",
  source_notes: "Source Notes",
  date_added: "Date Added",
  interview_notes: "Interview Notes",
  client_fit_tags: "Client Fit Tags",
  contract_history: "Contract History",
  last_contacted: "Last Contacted",
  next_follow_up: "Next Follow-Up",
  cv_filename: "CV Filename",
  notes: "Notes",
};

// Category groupings for form UI — matches Excel merged header row
export const CATEGORIES = [
  {
    name: "Personal Details",
    fields: ["resource_id", "full_name", "job_title_role"] as (keyof ResourceEntry)[],
  },
  {
    name: "Contact & Location",
    fields: ["email", "phone", "location", "right_to_work"] as (keyof ResourceEntry)[],
  },
  {
    name: "Availability & Rates",
    fields: [
      "status",
      "available_from",
      "day_rate_gbp",
      "rate_flexibility",
    ] as (keyof ResourceEntry)[],
  },
  {
    name: "Skills & Experience",
    fields: [
      "subject_matter_knowledge",
      "technical_skills",
      "systems",
      "experience_level",
      "years_experience",
    ] as (keyof ResourceEntry)[],
  },
  {
    name: "Sourcing & Assessment",
    fields: [
      "source_referral",
      "source_notes",
      "date_added",
      "interview_notes",
    ] as (keyof ResourceEntry)[],
  },
  {
    name: "Client Fit & History",
    fields: ["client_fit_tags", "contract_history"] as (keyof ResourceEntry)[],
  },
  {
    name: "Follow-Up & Admin",
    fields: [
      "last_contacted",
      "next_follow_up",
      "cv_filename",
      "notes",
    ] as (keyof ResourceEntry)[],
  },
] as const;

// Fields that use dropdown selects in the form
export const SELECT_FIELDS: Record<string, readonly string[]> = {
  right_to_work: RIGHT_TO_WORK_OPTIONS,
  status: STATUS_OPTIONS,
  rate_flexibility: RATE_FLEXIBILITY_OPTIONS,
  experience_level: EXPERIENCE_LEVEL_OPTIONS,
  source_referral: SOURCE_OPTIONS,
};

// Fields that should render as textarea (long text)
export const TEXTAREA_FIELDS: (keyof ResourceEntry)[] = [
  "subject_matter_knowledge",
  "technical_skills",
  "systems",
  "client_fit_tags",
  "contract_history",
  "interview_notes",
  "notes",
];
