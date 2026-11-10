export interface Actor {
  uid: string | null;
  email: string | null;
  name: string;
}

export interface TemplateVersion {
  version: number;
  fileName: string;
  ext: string;
  size: number;
  contentType: string;
  uploadedAt: number;
  uploadedBy: Actor;
  note: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  entity: string;
  docNumber: string;
  docNumberRegistered: boolean;
  fileName: string;
  ext: string;
  size: number;
  contentType: string;
  version: number;
  versions?: TemplateVersion[];
  createdAt: number;
  createdBy: Actor;
  updatedAt: number;
  updatedBy: Actor;
}

export interface TemplateList {
  templates: DocumentTemplate[];
  categories: string[];
  entities: string[];
  canManage: boolean;
}

export interface AuditLog {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  actor: Actor;
  changes: { field: string; from: unknown; to: unknown }[];
  note: string;
  at: number;
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
}
