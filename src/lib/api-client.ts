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
    let errorMessage = `API call failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = `API call failed: ${errorData.error}`;
      }
    } catch {
      // If we can't parse the error as JSON, use the status text
      console.log(errorMessage);
      throw new Error(errorMessage);
    }

  }

  const data = await response.json();
  return unwrapAPIResponse<T>(data);
}
