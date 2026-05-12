"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const locale = useLocale();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #16a085 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "system-ui, sans-serif",
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
        <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>🌿</div>
        <h1 style={{ color: "#1e293b", fontWeight: 700, fontSize: "2rem", marginBottom: "0.25rem" }}>
          404
        </h1>
        <p style={{ color: "#475569", fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          {t("title")}
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "2rem" }}>
          {t("subtitle")}
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href={`/${locale}/login`}
            style={{
              background: "#059669",
              color: "white",
              textDecoration: "none",
              borderRadius: "0.5rem",
              padding: "0.6rem 1.5rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              display: "inline-block",
            }}
          >
            {t("goLogin")}
          </Link>
          <Link
            href={`/${locale}/transparency`}
            style={{
              background: "#f1f5f9",
              color: "#475569",
              textDecoration: "none",
              borderRadius: "0.5rem",
              padding: "0.6rem 1.5rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              display: "inline-block",
            }}
          >
            {t("goPublic")}
          </Link>
        </div>
      </div>
    </div>
  );
}
