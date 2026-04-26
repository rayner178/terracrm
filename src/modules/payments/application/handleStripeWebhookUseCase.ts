import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";
import { IDonationRepository } from "@/modules/funding/domain/Donation";
import Stripe from "stripe";

export class HandleStripeWebhookUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute(body: string, signature: string): Promise<{ success: boolean; alreadyProcessed?: boolean }> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // Solo manejamos pagos exitosos por ahora
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const stripeSessionId = session.id;
      const metadata = session.metadata || {};
      
      // 1. Verificar idempotencia
      const existingDonation = await this.donationRepository.findByStripeSessionId(stripeSessionId);
      if (existingDonation) {
        console.log(`[Idempotencia] Sesión de Stripe ya procesada: ${stripeSessionId}`);
        return { success: true, alreadyProcessed: true };
      }

      // 2. Extraer datos de la metadata (Paso 1a)
      const donorName = metadata.donorName || session.customer_details?.name || "Anónimo";
      const donorEmail = session.customer_details?.email || "";
      const locale = metadata.locale || "es";
      const projectId = metadata.projectId || undefined;
      const amount = (session.amount_total || 0) / 100;

      // 3. Registrar donación en la DB
      await this.donationRepository.create({
        donorName,
        amount,
        locale,
        stripeSessionId,
        isRecurring: session.mode === "subscription",
        projectId: projectId && projectId.trim() !== "" ? projectId : undefined,
      });

      // 4. Enviar email localizado vía Resend
      if (donorEmail && process.env.RESEND_API_KEY) {
        const subject = locale === "en" ? "Thank you for your donation! 🌱" : "¡Gracias por tu donación! 🌱";
        const message = locale === "en" 
          ? `Hi ${donorName}, we received your donation of $${amount}. Thank you for supporting our conservation efforts!` 
          : `Hola ${donorName}, hemos recibido tu donación de $${amount}. ¡Gracias por apoyar nuestros esfuerzos de conservación!`;

        await resend.emails.send({
          from: "TerraCRM <onboarding@resend.dev>",
          to: donorEmail,
          subject,
          html: `<p>${message}</p>`,
        });
      }
    }

    return { success: true };
  }
}
