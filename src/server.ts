import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { getUsersCollection, getSuggestionsCollection, ObjectId, type CompanySuggestion } from "./lib/db";
import type { User } from "./lib/auth";
import { signJwt } from "./lib/api/utils";
import { handleMetricsApi } from "./lib/api/metrics";
import { handleRisksApi } from "./lib/api/risks";
import { handleRoadmapApi } from "./lib/api/roadmap";
import { handleActivityApi } from "./lib/api/activity";
import { handleDecisionsApi } from "./lib/api/decisions";
import { handleReportsApi } from "./lib/api/reports";
import { handleCompetitorsApi } from "./lib/api/competitors";
import { handleNotificationsApi } from "./lib/api/notifications";
import { handleChatApi } from "./lib/api/chat";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ message }, status);
}

async function parseJsonBody(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

async function handleAuthApi(request: Request): Promise<Response> {
  const url = new URL(request.url);

  try {
    if (url.pathname === "/api/auth/register" && request.method === "POST") {
      const body = await parseJsonBody(request);
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      const name = String(body.name ?? "").trim();
      const company = String(body.company ?? "").trim();

      if (!email || !password || !name || !company) {
        return errorResponse("Missing required registration fields.", 422);
      }

      const users = await getUsersCollection();
      const existing = await users.findOne({ email });
      if (existing) {
        return errorResponse("An account already exists with that email.", 409);
      }

      const user: User = {
        name,
        role: String(body.role ?? "Owner").trim() || "Owner",
        company,
        email,
        password,
        phone: String(body.phone ?? "").trim() || undefined,
        industry: String(body.industry ?? "").trim() || undefined,
        monthlyRevenue: String(body.monthlyRevenue ?? "").trim() || undefined,
        businessDescription: String(body.businessDescription ?? "").trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      await users.insertOne(user);
      const { _id, ...safeUser } = user as User & { _id?: unknown };
      const token = signJwt({ userId: String(_id), email: safeUser.email, company: safeUser.company, name: safeUser.name });
      return jsonResponse({ user: safeUser, token }, 201);
    }

    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      const body = await parseJsonBody(request);
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");

      if (!email || !password) {
        return errorResponse("Email and password are required.", 422);
      }

      const users = await getUsersCollection();
      const user = await users.findOne({ email, password });
      if (!user) {
        return errorResponse("Invalid email or password.", 401);
      }

      const { _id, ...safeUser } = user as User & { _id?: unknown };
      const token = signJwt({ userId: String(_id), email: safeUser.email, company: safeUser.company, name: safeUser.name });
      return jsonResponse({ user: safeUser, token });
    }

    if (url.pathname === "/api/auth/user" && request.method === "PUT") {
      const body = await parseJsonBody(request);
      const email = String(body.email ?? "").trim().toLowerCase();

      if (!email) {
        return errorResponse("Email is required to update user.", 422);
      }

      const updates: Partial<User> = {
        name: body.name ? String(body.name).trim() : undefined,
        company: body.company ? String(body.company).trim() : undefined,
        role: body.role ? String(body.role).trim() : undefined,
        phone: body.phone ? String(body.phone).trim() : undefined,
        industry: body.industry ? String(body.industry).trim() : undefined,
        monthlyRevenue: body.monthlyRevenue ? String(body.monthlyRevenue).trim() : undefined,
        businessDescription: body.businessDescription ? String(body.businessDescription).trim() : undefined,
        website: body.website ? String(body.website).trim() : undefined,
        timezone: body.timezone ? String(body.timezone).trim() : undefined,
        password: body.password ? String(body.password) : undefined,
      };

      const users = await getUsersCollection();
      const result = await users.findOneAndUpdate(
        { email },
        { $set: updates },
        { returnDocument: "after" },
      );

      if (!result) {
        return errorResponse("User not found.", 404);
      }

      const { _id, ...safeUser } = result as User & { _id?: unknown };
      const token = signJwt({ userId: String(_id), email: safeUser.email, company: safeUser.company, name: safeUser.name });
      return jsonResponse({ user: safeUser, token });
    }

    // Company suggestions endpoints
    if (url.pathname === "/api/suggestions" && request.method === "GET") {
      const userEmail = url.searchParams.get("email");
      if (!userEmail) {
        return errorResponse("Email parameter is required.", 422);
      }

      const suggestions = await getSuggestionsCollection();
      const items = await suggestions.find({ userEmail: userEmail.toLowerCase() }).toArray();
      return jsonResponse({ suggestions: items });
    }

    if (url.pathname === "/api/suggestions" && request.method === "POST") {
      const body = await parseJsonBody(request);
      const userEmail = String(body.userEmail ?? "").trim().toLowerCase();
      const title = String(body.title ?? "").trim();
      const description = String(body.description ?? "").trim();
      const category = String(body.category ?? "growth").trim();

      if (!userEmail || !title || !description) {
        return errorResponse("Missing required fields: userEmail, title, description.", 422);
      }

      const suggestion: CompanySuggestion = {
        userEmail,
        title,
        description,
        category: category as CompanySuggestion["category"],
        createdAt: new Date().toISOString(),
        status: "pending",
        impact: String(body.impact ?? "").trim() || undefined,
        priority: (String(body.priority ?? "medium").trim() || "medium") as CompanySuggestion["priority"],
      };

      const suggestions = await getSuggestionsCollection();
      const result = await suggestions.insertOne(suggestion);
      return jsonResponse({ suggestion: { ...suggestion, _id: result.insertedId } }, 201);
    }

    if (url.pathname === "/api/suggestions" && request.method === "PUT") {
      const body = await parseJsonBody(request);
      const _id = String(body._id ?? "").trim();
      const status = String(body.status ?? "pending").trim();

      if (!_id || !["pending", "accepted", "rejected"].includes(status)) {
        return errorResponse("Missing or invalid _id or status.", 422);
      }

      let objectId: ObjectId;
      try {
        objectId = new ObjectId(_id);
      } catch {
        return errorResponse("Invalid suggestion id.", 422);
      }

      const suggestions = await getSuggestionsCollection();
      const result = await suggestions.findOneAndUpdate(
        { _id: objectId as unknown as string },
        { $set: { status: status as CompanySuggestion["status"] } },
        { returnDocument: "after" },
      );

      if (!result) {
        return errorResponse("Suggestion not found.", 404);
      }

      return jsonResponse({ suggestion: result });
    }

    return errorResponse("Unknown API route.", 404);
  } catch (error) {
    console.error("Auth API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error in auth API.";
    return errorResponse(message, 500);
  }
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/api/auth/") || url.pathname === "/api/suggestions") {
        return await handleAuthApi(request);
      }
      if (url.pathname.startsWith("/api/metrics")) return await handleMetricsApi(request);
      if (url.pathname.startsWith("/api/risks")) return await handleRisksApi(request);
      if (url.pathname.startsWith("/api/roadmap")) return await handleRoadmapApi(request);
      if (url.pathname.startsWith("/api/activity")) return await handleActivityApi(request);
      if (url.pathname.startsWith("/api/decisions")) return await handleDecisionsApi(request);
      if (url.pathname.startsWith("/api/reports")) return await handleReportsApi(request);
      if (url.pathname.startsWith("/api/competitors")) return await handleCompetitorsApi(request);
      if (url.pathname.startsWith("/api/notifications")) return await handleNotificationsApi(request);
      if (url.pathname.startsWith("/api/chat")) return await handleChatApi(request);

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
