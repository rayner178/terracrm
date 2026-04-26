import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/api') || 
    req.nextUrl.pathname.startsWith('/_next') || 
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const hostname = req.headers.get("host") || "";
  let tenantSlug = "fundemar";

  if (hostname.includes(".terracrm.org")) {
    tenantSlug = hostname.split(".")[0];
  } else if (hostname.includes("localhost") && req.cookies.has("local_tenant")) {
    tenantSlug = req.cookies.get("local_tenant")?.value || "fundemar";
  }

  const response = intlMiddleware(req);
  response.headers.set("x-middleware-request-x-tenant-slug", tenantSlug);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
