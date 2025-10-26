import { NextResponse } from "next/server";
import type { APIResponse } from "@/types";

const API_VERSION = "v1";

/**
 * Create a standardized API response with versioning and metadata
 */
export function createAPIResponse<T>(
  data: T,
  options?: {
    requestId?: string;
    status?: number;
  }
): NextResponse {
  const response: APIResponse<T> = {
    data,
    meta: {
      version: API_VERSION,
      timestamp: new Date().toISOString(),
      requestId: options?.requestId,
    },
  };

  return NextResponse.json(response, { status: options?.status || 200 });
}

/**
 * Create an error response with versioning
 */
export function createErrorResponse(
  error: string | Error,
  status: number = 500,
  options?: {
    requestId?: string;
    details?: any;
  }
): NextResponse {
  const errorMessage = typeof error === "string" ? error : error.message;

  return NextResponse.json(
    {
      error: {
        message: errorMessage,
        status,
        details: options?.details,
      },
      meta: {
        version: API_VERSION,
        timestamp: new Date().toISOString(),
        requestId: options?.requestId,
      },
    },
    { status }
  );
}

/**
 * Generate a unique request ID for tracking
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Extract request ID from headers or generate new one
 */
export function getRequestId(headers: Headers): string {
  return headers.get("x-request-id") || generateRequestId();
}
