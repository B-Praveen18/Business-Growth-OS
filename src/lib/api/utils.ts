import { createHmac } from "crypto";

// --- JSON Response Helpers ---

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function errorResponse(message: string, status = 400) {
  return jsonResponse({ message }, status);
}

export async function parseJsonBody(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

// --- JWT Helpers (HMAC-SHA256, zero dependencies) ---

const JWT_SECRET = () => process.env.JWT_SECRET ?? "businessos-default-secret-change-me";

export interface JwtPayload {
  userId: string;
  email: string;
  company: string;
  name: string;
  iat: number;
  exp: number;
}

export function signJwt(
  payload: Omit<JwtPayload, "iat" | "exp">,
  expiresInSeconds = 86400 * 7,
): string {
  const now = Math.floor(Date.now() / 1000);
  const full = { ...payload, iat: now, exp: now + expiresInSeconds };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(full)).toString("base64url");
  const signature = createHmac("sha256", JWT_SECRET())
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = createHmac("sha256", JWT_SECRET())
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as JwtPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// --- Auth Middleware ---

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export function extractAuth(request: Request): JwtPayload | null {
  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return verifyJwt(authHeader.slice(7));
}

export function requireAuth(request: Request): JwtPayload {
  const payload = extractAuth(request);
  if (!payload) throw new AuthError("Authentication required.", 401);
  return payload;
}
