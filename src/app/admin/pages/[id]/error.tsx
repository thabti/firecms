"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page editor error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-mono">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button onClick={() => window.history.back()} variant="outline">
              Go back
            </Button>
          </div>

          <div className="text-sm text-gray-600 mt-6">
            <p className="font-semibold mb-2">Common causes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Network connection issues</li>
              <li>Storage adapter not properly configured</li>
              <li>Invalid page data</li>
              <li>Permission errors</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
