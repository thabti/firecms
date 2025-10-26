"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public page error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Oops! Something went wrong
        </h1>

        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          We encountered an error while loading this page. Please try again or return to the homepage.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = "/"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "white",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Go to Homepage
          </button>
        </div>

        {error.digest && (
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "1.5rem" }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
