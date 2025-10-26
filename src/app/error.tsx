"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Application Error
            </h1>

            <p className="text-gray-600 mb-8">
              {error.message || "An unexpected error occurred. Please try refreshing the page."}
            </p>

            <div className="flex gap-3 justify-center">
              <Button onClick={reset}>
                Try again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                Go to Homepage
              </Button>
            </div>

            {error.digest && (
              <p className="text-xs text-gray-500 mt-6">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
