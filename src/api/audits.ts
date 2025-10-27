import { api } from "./auth";

export interface Line { id: number; code?: string; name?: string; area?: string }
export interface Person { id: number; name?: string; email?: string; employee_number?: string }

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

export async function listAudits(page = 1): Promise<AuditsListResponse> {
  const headerAuth = api.defaults.headers.common["Authorization"] as string | undefined;
  const storedToken = localStorage.getItem("audits:token");
  const token = headerAuth?.replace(/^Bearer\s+/i, "") || storedToken || undefined;

  const resp = await api.get("/api/v1/audits", {
    params: { page },
    ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  });
  return resp.data as AuditsListResponse;
}

export async function getAudit(id: number): Promise<AuditItem> {
  const headerAuth = api.defaults.headers.common["Authorization"] as string | undefined;
  const storedToken = localStorage.getItem("audits:token");
  const token = headerAuth?.replace(/^Bearer\s+/i, "") || storedToken || undefined;

  const resp = await api.get(`/api/v1/audits/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return resp.data as AuditItem;
}

export default { listAudits, getAudit };
