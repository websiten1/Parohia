import { NextResponse } from "next/server";
import { ZodError } from "zod";

/** Every failure leaves the API as { error: { code, message, fields? } }. */
export interface ApiErrorBody {
  error: { code: string; message: string; fields?: Record<string, string[]> };
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const badRequest = (code: string, message: string, fields?: Record<string, string[]>) =>
  new ApiError(400, code, message, fields);
export const unauthorized = (message = "You need to sign in to do that.") =>
  new ApiError(401, "unauthorized", message);
export const forbidden = (message = "You do not have access to this parish.") =>
  new ApiError(403, "forbidden", message);
export const notFound = (message = "Not found.") => new ApiError(404, "not_found", message);
export const conflict = (code: string, message: string) => new ApiError(409, code, message);
export const tooManyRequests = (message = "Too many attempts. Try again shortly.") =>
  new ApiError(429, "too_many_requests", message);

function toBody(err: unknown): { status: number; body: ApiErrorBody } {
  if (err instanceof ApiError) {
    return {
      status: err.status,
      body: { error: { code: err.code, message: err.message, ...(err.fields && { fields: err.fields }) } },
    };
  }
  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "_";
      (fields[key] ??= []).push(issue.message);
    }
    return {
      status: 400,
      body: { error: { code: "invalid_request", message: "Some fields need fixing.", fields } },
    };
  }
  console.error("unhandled API error:", err);
  return { status: 500, body: { error: { code: "internal_error", message: "Something went wrong." } } };
}

/**
 * Wraps a route handler so every thrown ApiError or ZodError becomes the one
 * error shape, and anything unexpected becomes a 500 that never leaks a stack
 * trace to the client.
 */
export function route<A extends unknown[]>(
  handler: (req: Request, ...args: A) => Promise<Response>,
) {
  return async (req: Request, ...args: A): Promise<Response> => {
    try {
      return await handler(req, ...args);
    } catch (err) {
      const { status, body } = toBody(err);
      return NextResponse.json(body, { status });
    }
  };
}

/** Parses a JSON body, turning a malformed one into a clean 400. */
export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw badRequest("invalid_json", "The request body was not valid JSON.");
  }
}
