import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/api') || 
    req.nextUrl.pathname.startsWith('/_next') || 
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Skip token check on auth routes — avoids JWT parsing overhead on login
  const isAuthRoute = req.nextUrl.pathname.includes('/login') ||
                      req.nextUrl.pathname.includes('/change-password') ||
                      req.nextUrl.pathname.startsWith('/api/auth');

  if (!isAuthRoute) {
    // Comprobar token para mustChangePassword solo en rutas protegidas
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "supersecret123" });
    if (token && token.mustChangePassword) {
      return NextResponse.redirect(new URL('/es/change-password', req.url));
    }
  }

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/es', req.url));
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
