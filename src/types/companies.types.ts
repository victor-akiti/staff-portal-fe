import type { Actor } from "./templates.types";

/** companyNames / requestedCompanies documents (legacy shape) */
export interface Company {
  id: string;
  code: string;
  label?: string;
  companyName: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  registered: boolean | string | null;
  approved: boolean | string | null;
  status: string | null;
  requestStatus: "approved" | "requested";
  createdBy?: Actor & { portal?: string };
  approvedBy?: Actor | null;
  timestamp?: number;
  approvedTimestamp?: number | null;
  updatedAt?: number;
  updatedBy?: Actor;
}

export interface CompanyFields {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  registered: boolean;
  approved: boolean;
}

export interface NameMatch {
  code: string;
  companyName: string;
  pending: boolean;
  score?: number;
}

export interface CodePreview {
  code: string;
  exactDuplicate: NameMatch | null;
  similar: NameMatch[];
}
