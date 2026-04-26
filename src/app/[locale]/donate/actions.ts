"use server";

import { container } from "@/core/di/registry";
import { redirect } from "next/navigation";

export async function processDonationAction(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const donorName = formData.get("donorName") as string;
  const donorEmail = formData.get("donorEmail") as string;
  const locale = formData.get("locale") as string || "es";
  const projectId = formData.get("projectId") as string;

  if (!amount || amount <= 0 || !donorName || !donorEmail) {
    throw new Error("Missing required fields");
  }

  const { url } = await container.createCheckoutSessionUseCase.execute({
    amount,
    donorName,
    donorEmail,
    locale,
    projectId: projectId || undefined,
  });

  // Redirect a la página de Checkout de Stripe
  redirect(url);
}
