import { NextRequest, NextResponse } from "next/server";
import { container } from "@/core/di/registry";

export async function POST(req: NextRequest) {
  // EXTREMADAMENTE IMPORTANTE: Leer el body como TEXTO plano, no JSON.
  // Si Next.js parsea a JSON, la firma de Stripe fallará.
  const body = await req.text(); 
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const result = await container.handleStripeWebhookUseCase.execute(body, signature);
    
    // Devolvemos 200 siempre que el caso de uso haya tenido éxito (incluso si era un duplicado/idempotente)
    return NextResponse.json({ received: true, alreadyProcessed: result.alreadyProcessed || false }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe Webhook Error:", error.message);
    // Para errores de validación de firma o casos no contemplados, mandamos 400
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
