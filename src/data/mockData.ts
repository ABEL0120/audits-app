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

export const MOCK_AUDITS: AuditMeta[] = [
    { id: 1, code: 'AUD-2025-00123', title: 'Revisión de Seguridad - Planta Norte', line: 'Planta Norte', shift: 'A', employee_number: 'E-1001', employee_name: 'Carlos López', supervisor_name: 'María Ruiz', status: 'draft' },
    { id: 2, code: 'AUD-2025-00124', title: 'Auditoría de Calidad - Almacén Central', line: 'Almacén Central', shift: 'B', employee_number: 'E-1022', employee_name: 'Ana Gómez', supervisor_name: 'Luis Pérez', status: 'in_progress', started_at: '2025-10-12T09:00:00Z' },
];

export const MOCK_ITEMS: Item[] = [
    { id: 101, tool_code: 'T-001', tool_name: 'Cinta transportadora', model: 'CT-200', description: 'Revisar tensado y rodillos', photos: [], defects: [] },
    { id: 102, tool_code: 'T-002', tool_name: 'Engranaje principal', model: 'EG-5', description: 'Buscar desgaste', photos: [], defects: [] },
    { id: 103, tool_code: 'T-003', tool_name: 'Panel eléctrico', model: 'PE-3', description: 'Inspeccionar conexiones', photos: [], defects: [] },
];
