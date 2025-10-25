export interface AuditMeta {
    id: number;
    code: string;
    title: string;
    line: string;
    shift: 'A' | 'B' | 'C';
    employee_number: string;
    employee_name?: string;
    supervisor_name?: string;
    status: 'draft' | 'in_progress' | 'submitted' | 'reviewed' | 'closed';
    started_at?: string | null;
}

export interface Item {
    id: number;
    tool_code: string;
    tool_name: string;
    model?: string;
    description?: string;
    result?: 'PASS' | 'FAIL' | 'NA';
    photos: Array<{ id: string; caption?: string }>;
    defects: Array<{ type: string; severity?: string; description: string; suggested_action?: string }>;
    comments?: string;
}

export const MOCK_AUDITS: AuditMeta[] = [];

export const MOCK_ITEMS: Item[] = [];
