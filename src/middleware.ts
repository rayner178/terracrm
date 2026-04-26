import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Excluir rutas de API y estáticos
  if (req.nextUrl.pathname.startsWith('/api') || 
      req.nextUrl.pathname.startsWith('/_next') || 
      req.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  const hostname = req.headers.get("host") || "";
  let tenantSlug = "fundemar"; // Fallback por defecto o para localhost

  // Lógica de ruteo por subdominio (ej: fundemar.terracrm.org -> fundemar)
  if (hostname.includes(".terracrm.org")) {
    tenantSlug = hostname.split(".")[0];
  } else if (hostname.includes("localhost") && req.cookies.has("local_tenant")) {
    tenantSlug = req.cookies.get("local_tenant")?.value || "fundemar";
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant-slug", tenantSlug);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
