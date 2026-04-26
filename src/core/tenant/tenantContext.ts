import { headers } from "next/headers";

export async function getTenantSlug(): Promise<string> {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug") || 
               headersList.get("x-middleware-request-x-tenant-slug") || 
               "fundemar";
  return slug;
}
