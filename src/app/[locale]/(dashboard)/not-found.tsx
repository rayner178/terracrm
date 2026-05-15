"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileQuestion, Home } from "lucide-react";

export default function ContextualNotFound() {
  const t = useTranslations("NotFound");
  const pathname = usePathname();

  // Determine context
  let contextKey = "defaultContext";
  if (pathname.includes("/projects/")) contextKey = "projectContext";
  else if (pathname.includes("/volunteers/")) contextKey = "volunteerContext";
  else if (pathname.includes("/funding/")) contextKey = "fundingContext";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <FileQuestion className="w-10 h-10 text-slate-400" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-lg font-medium text-slate-600 mb-2">
        {t("title")}
      </p>
      <p className="text-sm text-slate-500 mb-8 max-w-md">
        {t(contextKey)}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm"
      >
        <Home className="w-4 h-4" />
        {t("goHome")}
      </Link>
    </div>
  );
}
