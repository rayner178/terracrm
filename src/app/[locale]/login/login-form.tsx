"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("Login");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(t("errorInvalid"));
      setLoading(false);
    } else {
      if ((res as any)?.mustChangePassword) {
        router.push("/es/change-password");
      } else {
        router.push("/es");
      }
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">{t("emailLabel")}</label>
          <Input name="email" type="email" required placeholder={t("emailPlaceholder")} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">{t("passwordLabel")}</label>
          <div className="relative mt-1">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder={t("passwordPlaceholder")}
              className="pr-10 py-3 min-h-[44px]"
              onKeyDown={(e) => setCapsLock(e.getModifierState("CapsLock"))}
              onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {capsLock && (
            <p className="mt-1 text-xs font-medium text-amber-600 flex items-center gap-1">
              {t("capsLockWarning")}
            </p>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
        {loading ? t("loading") : t("submit")}
      </Button>
    </form>
  );
}
