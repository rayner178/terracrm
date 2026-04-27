"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[TerraCRM] Error no capturado:", error);
  }, [error]);

  const router = useRouter();

  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #16a085 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "2.5rem",
              maxWidth: "480px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h1 style={{ color: "#1e293b", fontWeight: 700, fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Algo salió mal
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              El sistema encontró un error inesperado. Esto puede ser temporal — intenta recargar la página.
            </p>
            {error?.digest && (
              <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
                Código: {error.digest}
              </p>
            )}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={reset}
                style={{
                  background: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.6rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                🔄 Recargar
              </button>
              <button
                onClick={() => router.push("/es/login")}
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.6rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Ir al Login
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
