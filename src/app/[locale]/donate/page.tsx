import { getTranslations } from "next-intl/server";
import { processDonationAction } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donar — TerraCRM",
  description: "Apoya la conservación ambiental. Tu donación protege ecosistemas.",
  openGraph: {
    title: "Apoya Nuestra Causa 🌿",
    description: "El 88% de tu donación va directo a conservación. Únete al cambio.",
    type: "website",
  },
};

export default async function DonatePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations("Donate");
  const { locale } = params;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-emerald-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{t("heroTitle")}</h1>
          <p className="text-emerald-100">{t("heroSubtitle")}</p>
        </div>

        <form action={processDonationAction} className="p-8 space-y-6">
          <input type="hidden" name="locale" value={locale} />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("nameLabel")}</label>
              <input
                type="text"
                name="donorName"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors min-h-[44px]"
                placeholder={t("namePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("emailLabel")}</label>
              <input
                type="email"
                name="donorEmail"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors min-h-[44px]"
                placeholder={t("emailPlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t("amountLabel")}</label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Opciones predefinidas con algo de JS de UI si fuera un Client Component, pero aquí usamos HTML forms */}
              </div>
              <input
                type="number"
                name="amount"
                required
                min="5"
                className="w-full px-4 py-3 text-xl font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors min-h-[44px]"
                placeholder={t("amountPlaceholder")}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {t("submit")}
          </button>

          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <a href="/transparency" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center">
              {t("transparencyLink")}
            </a>
          </div>

          <p className="text-xs text-center text-slate-500 mt-4">
            {t("stripeNote")}
          </p>
        </form>
      </div>
    </div>
  );
}
