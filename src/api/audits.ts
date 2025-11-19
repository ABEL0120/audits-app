// --- START OF FILE audits.ts (CORREGIDO) ---

import { api } from "./auth";

// (Todas tus interfaces: Line, Person, Assignment, etc. se quedan igual)
export interface Line {
  id: number;
  code?: string;
  name?: string;
  area?: string;
}
export interface Person {
  id: number;
  name?: string;
  email?: string;
  employee_number?: string;
}

export interface Assignment {
  id: number;
  supervisor_id?: number;
  technician_id?: number;
  line_id?: number;
  shift?: string;
  status?: string;
  assigned_at?: string | null;
  due_at?: string | null;
  notes?: string | null;
}

export interface Tool {
  id: number;
  code?: string;
  name?: string;
  model?: string;
  description?: string;
  line_id?: number;
}

export interface AuditItemDetail {
  id: number;
  audit_id?: number;
  tool_id?: number;
  result?: string | null;
  comments?: string | null;
  defects?: any;
  tool?: Tool | null;
}

export interface AuditItem {
  id: number;
  audit_code?: string;
  assignment_id?: number;
  technician_id?: number;
  supervisor_id?: number;
  employee_number?: string;
  line_id?: number;
  shift?: string;
  status?: string;
  summary?: string | null;
  overall_result?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  created_at?: string;
  updated_at?: string;
  assignment?: Assignment | null;
  technician?: Person | null;
  supervisor?: Person | null;
  line?: Line | null;
  items?: AuditItemDetail[] | null;
}

export interface AuditsListResponse {
  current_page: number;
  data: AuditItem[];
  last_page: number;
  total: number;
}

/**
 * Pide la lista de auditorías.
 * No se preocupa por el caché. El Service Worker hará la magia.
 */
export async function listAudits(page = 1): Promise<AuditsListResponse> {
  const resp = await api.get("/api/v1/audits", {
    params: { page },
  });
  return resp.data as AuditsListResponse;
}

/**
 * Pide una auditoría específica por su ID.
 * El Service Worker también se encargará de esto.
 */
export async function getAudit(id: number): Promise<AuditItem> {
  const resp = await api.get(`/api/v1/audits/${id}`);
  return resp.data as AuditItem;
}

export default { listAudits, getAudit };
