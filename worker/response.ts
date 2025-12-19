import { ErrorResponse } from './types';

export function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Client-ID',
  };
}

export function jsonResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(),
    },
  });
}

export function errorResponse(
  error: string,
  details?: string,
  status = 500,
): Response {
  const response: ErrorResponse = { error };
  if (details) {
    response.details = details;
  }
  return jsonResponse(response, status);
}

export function handleOptions(): Response {
  return new Response(null, { status: 204, headers: getCorsHeaders() });
}
