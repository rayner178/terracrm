import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export function withApiAuth(
  handler: (req: NextRequest, session: any) => Promise<NextResponse>,
  allowedRoles?: string[]
) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const role = (session.user as any)?.role;
    
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return new NextResponse("Forbidden: Permisos Insuficientes", { status: 403 });
    }

    return handler(req, session);
  };
}
