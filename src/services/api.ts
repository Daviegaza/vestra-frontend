export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

const RAW_BASE = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:4000';
export const API_BASE = RAW_BASE.replace(/\/$/, '');

const TOKEN_KEY = 'vestra_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = opts;
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };
  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }
  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    throw new ApiError(e instanceof Error ? e.message : 'Network error', 0, 'NETWORK_ERROR');
  }

  if (!response.ok) {
    let payload: unknown = null;
    try { payload = await response.json(); } catch { /* noop */ }
    const errMsg = (payload && typeof payload === 'object' && 'error' in payload)
      ? String((payload as { error: unknown }).error)
      : `HTTP ${response.status}`;
    throw new ApiError(errMsg, response.status, `HTTP_${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// Legacy mock helpers (kept for files still using them during migration)

export function delay(ms?: number): Promise<void> {
  const t = ms ?? (200 + Math.random() * 600);
  return new Promise((r) => setTimeout(r, t));
}

export function maybeThrow(rate = 0.03): void {
  if (Math.random() < rate) {
    throw new ApiError('Network error. Please try again.', 500, 'NETWORK_ERROR');
  }
}

export async function mockCall<T>(data: T, delayMs?: number, errorRate?: number): Promise<T> {
  await delay(delayMs);
  maybeThrow(errorRate);
  return JSON.parse(JSON.stringify(data));
}
