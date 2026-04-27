import { getTranslations } from "next-intl/server";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const t = await getTranslations("Login");

  return (
    <div
      className="flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #16a085 100%)",
        minHeight: "100vh"
      }}
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{t("title")}</h2>
          <p className="mt-2 text-sm text-slate-600">{t("subtitle")}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
