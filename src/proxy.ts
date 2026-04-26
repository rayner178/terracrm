import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// 1. Inicializamos el middleware de next-intl
const intlMiddleware = createMiddleware(routing);

export function proxy(req: NextRequest) {
  // 2. Excluir rutas de API y estáticos
  if (
    req.nextUrl.pathname.startsWith('/api') || 
    req.nextUrl.pathname.startsWith('/_next') || 
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 3. Detectar tenant por subdominio
  const hostname = req.headers.get("host") || "";
  let tenantSlug = "fundemar"; // Fallback por defecto o para localhost

  if (hostname.includes(".terracrm.org")) {
    tenantSlug = hostname.split(".")[0];
  } else if (hostname.includes("localhost") && req.cookies.has("local_tenant")) {
    tenantSlug = req.cookies.get("local_tenant")?.value || "fundemar";
  }

  // 4. Pasar la request al middleware de next-intl para que maneje el idioma
  const response = intlMiddleware(req);

  // 5. Inyectar x-tenant-slug en el Request downstream
  response.headers.set("x-middleware-request-x-tenant-slug", tenantSlug);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
