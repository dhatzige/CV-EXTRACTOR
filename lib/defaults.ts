// ============================================================
// Auto-fill defaults for fields not extractable from CVs
// ============================================================

import { ResourceEntry } from "./schema";

export function applyDefaults(
  extracted: Partial<ResourceEntry>,
  filename: string
): ResourceEntry {
  const today = new Date().toISOString().split("T")[0];

  return {
    resource_id: "",
    full_name: extracted.full_name ?? "",
    job_title_role: extracted.job_title_role ?? "",
    email: extracted.email ?? "",
    phone: extracted.phone ?? "",
    location: extracted.location ?? "",
    right_to_work: extracted.right_to_work ?? "Other",
    status: "Available",
    available_from: extracted.available_from ?? "TBC",
    day_rate_gbp: "",
    rate_flexibility: "",
    subject_matter_knowledge: extracted.subject_matter_knowledge ?? "",
    technical_skills: extracted.technical_skills ?? "",
    systems: extracted.systems ?? "",
    experience_level: extracted.experience_level ?? "Consultant",
    years_experience: extracted.years_experience ?? 0,
    source_referral: "CV Upload",
    source_notes: "",
    date_added: today,
    interview_notes: "",
    client_fit_tags: extracted.client_fit_tags ?? "",
    contract_history: extracted.contract_history ?? "",
    last_contacted: "",
    next_follow_up: "",
    cv_filename: filename,
    notes: extracted.notes ?? "",
  };
}
