import { stripe } from "@/lib/stripe";
import { z } from "zod";
import { ValidationError } from "@/core/errors/DomainError";

const schema = z.object({
  amount: z.number().positive("El monto debe ser positivo"),
  donorName: z.string().min(2, "El nombre debe ser válido"),
  donorEmail: z.string().email("Correo electrónico inválido"),
  locale: z.string().default("es"),
  projectId: z.string().uuid().optional(),
});

export class CreateCheckoutSessionUseCase {
  async execute(input: any): Promise<{ url: string }> {
    const result = schema.safeParse(input);
    if (!result.success) throw new ValidationError(result.error.issues[0].message);

    const { amount, donorName, donorEmail, locale, projectId } = result.data;

    // Crear la sesión en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donación para ONG - ${donorName}`,
              description: projectId ? `Aportando al proyecto` : "Donación al fondo general",
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/${locale}/donate?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/${locale}/donate?canceled=true`,
      customer_email: donorEmail,
      // Metadata importante (Paso 1a): propaga el idioma al webhook
      metadata: {
        donorName,
        locale,
        projectId: projectId || "",
      },
    });

    if (!session.url) throw new Error("Error generando URL de Stripe");

    return { url: session.url };
  }
}
