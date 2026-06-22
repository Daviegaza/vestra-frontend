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
