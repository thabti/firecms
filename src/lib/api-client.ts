import type { APIResponse } from "@/types";

/**
 * Unwrap API response to extract data
 * Handles both old format (direct data) and new format (wrapped in APIResponse)
 */
export function unwrapAPIResponse<T>(responseData: any): T {
  // Check if response has the new APIResponse format
  if (responseData && typeof responseData === "object" && "data" in responseData && "meta" in responseData) {
    return responseData.data as T;
  }

  // Fallback to old format (direct data)
  return responseData as T;
}

/**
 * Helper function to make API calls with automatic response unwrapping
 */
export async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  const data = await response.json();
  return unwrapAPIResponse<T>(data);
}
