import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add performance and security headers
  response.headers.set("X-Robots-Tag", "index, follow");
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Add custom headers for debugging in development
  if (process.env.NODE_ENV === "development") {
    response.headers.set("X-Middleware-Cache", "miss");
  }

  // Cache public pages more aggressively
  if (request.nextUrl.pathname.startsWith("/") && !request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );
  }

  // Don't cache admin pages
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, max-age=0, must-revalidate"
    );
  }

  // Add timing header for performance monitoring
  const start = Date.now();
  response.headers.set("X-Response-Time", `${Date.now() - start}ms`);

  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
