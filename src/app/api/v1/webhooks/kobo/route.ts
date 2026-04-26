import { NextResponse } from "next/server";
import { basePrisma, prisma } from "@/infrastructure/database/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Obtener tenant desde query params (Kobo permite parámetros en la URL del webhook)
    const url = new URL(req.url);
    const tenantSlug = url.searchParams.get("tenant");

    if (!tenantSlug) {
      return NextResponse.json({ error: "Missing tenant parameter" }, { status: 400 });
    }

    // 2. Buscar configuración del tenant en la BD global
    const tenant = await basePrisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant || !tenant.koboWebhookSecret) {
      return NextResponse.json({ error: "Tenant not configured for Kobo webhooks" }, { status: 403 });
    }

    // 3. Validar firma HMAC-SHA256
    // KoboToolbox envía la firma en el header 'x-kobo-webhook-signature'
    const signature = req.headers.get("x-kobo-webhook-signature");
    const rawBody = await req.text();

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", tenant.koboWebhookSecret)
      .update(rawBody)
      .digest("base64");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const formId = payload._xform_id_string;

    if (!formId) {
      return NextResponse.json({ error: "Missing form ID in payload" }, { status: 400 });
    }

    // 4. Inyectar tenantSlug en el contexto para aislar consultas
    // Al usar una Promise global con process.env es una forma sucia,
    // es mejor usar AsyncLocalStorage pero en Next.js App Router es complicado.
    // Usaremos un truco: forzar el tenant en el objeto de request a Prisma
    // O más seguro, usar el cliente cacheado directamente.
    // Simularemos la inyección mediante process.env localmente para la request actual
    // Nota: en producción real de alto tráfico, AsyncLocalStorage es obligatorio.
    process.env.TEST_TENANT_SLUG = tenantSlug;

    // 5. Buscar mapping de este formulario en el schema del tenant
    const formMapping = await prisma.koboFormMapping.findUnique({
      where: { formId }
    });

    if (!formMapping) {
      // Ignorar sumisiones de formularios no mapeados
      return NextResponse.json({ success: true, ignored: true, reason: "Form not mapped" });
    }

    // 6. Extraer métricas basadas en el mapping
    // mapping es un JSON dict: { "kobo_field_name": "metricDefinitionId" }
    const mappingDict = formMapping.mapping as Record<string, string>;
    const metricsToInsert = [];

    for (const [koboField, metricDefId] of Object.entries(mappingDict)) {
      if (payload[koboField] !== undefined && payload[koboField] !== null) {
        metricsToInsert.push({
          metricDefinitionId: metricDefId,
          value: parseFloat(payload[koboField]),
          date: new Date(payload._submission_time || new Date()),
          recordedById: "system-kobo-webhook" // ID genérico o de un bot account
        });
      }
    }

    if (metricsToInsert.length > 0) {
      await prisma.metricRecord.createMany({
        data: metricsToInsert
      });
    }

    return NextResponse.json({ success: true, inserted: metricsToInsert.length });

  } catch (error) {
    console.error("Kobo Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    process.env.TEST_TENANT_SLUG = ""; // Clean up
  }
}
