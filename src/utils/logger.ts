type LogEntry = {
  id: string;
  time: string;
  level: 'error' | 'warn' | 'info';
  message?: string;
  stack?: string;
  context?: Record<string, unknown>;
};

const LS_LOGS_KEY = 'audits:logs';

function safeStringify(obj: unknown) {
  try {
    return JSON.stringify(obj);
  } catch {
    try {
      return String(obj);
    } catch {
      return 'unserializable';
    }
  }
}

export function logError(err: unknown, context?: Record<string, unknown>) {
  try {
    let message: string | undefined;
    let stack: string | undefined;
    if (typeof err === 'string') message = err;
    else if (typeof err === 'object' && err !== null) {
      const e = err as Record<string, unknown>;
      if (typeof e.message === 'string') message = e.message;
      if (typeof e.stack === 'string') stack = e.stack;
    }

    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      time: new Date().toISOString(),
      level: 'error',
      message: message,
      stack: stack,
      context: context ? (JSON.parse(safeStringify(context)) as Record<string, unknown>) : undefined,
    };

    // read existing
    const raw = localStorage.getItem(LS_LOGS_KEY);
    const arr: LogEntry[] = raw ? JSON.parse(raw) : [];
    arr.push(entry);
    // keep only latest 200 entries to avoid bloating storage
    const trimmed = arr.slice(-200);
    localStorage.setItem(LS_LOGS_KEY, JSON.stringify(trimmed));

    // also print to console for developers
    // keep the original error object visible in console
    console.error('[audits][error]', entry, err);
  } catch (e) {
    console.error('logger error', e);
  }
}

export function getLogs(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LS_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearLogs() {
  try {
    localStorage.removeItem(LS_LOGS_KEY);
  } catch (e) {
    console.debug('logger: clearLogs error', e);
  }
}

export default { logError, getLogs, clearLogs };
