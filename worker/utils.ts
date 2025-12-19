import { ErrorResponse } from './types';
import { CLIENT_ID_HEADER } from './constants';
import { jsonResponse } from './response';

export function getClientId(request: Request): string | null {
  return request.headers.get(CLIENT_ID_HEADER);
}

export function requireClientId(request: Request): Response | null {
  const clientId = getClientId(request);
  if (!clientId) {
    return jsonResponse<ErrorResponse>({ error: 'Client ID required' }, 400);
  }
  return null;
}

export function parseScore(value: string | null): number {
  if (!value) return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function validateScore(score: number): boolean {
  return typeof score === 'number' && !Number.isNaN(score) && score >= 0;
}

export function extractImageId(url: URL): string {
  const pathParts = url.pathname.split('/');
  return pathParts[pathParts.length - 1] || '';
}
