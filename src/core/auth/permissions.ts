import { Role } from "@prisma/client";

export type Permission = 
  | "manage:users"
  | "read:audit"
  | "manage:audit"
  | "read:projects"
  | "manage:projects"
  | "approve:projects"
  | "read:donations"
  | "manage:donations"
  | "approve:donations"
  | "read:volunteers"
  | "manage:volunteers";

const rolePermissions: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "manage:users", "read:audit", "manage:audit", 
    "read:projects", "manage:projects", "approve:projects",
    "read:donations", "manage:donations", "approve:donations",
    "read:volunteers", "manage:volunteers"
  ],
  DIRECTOR: [
    "read:projects", "read:donations", "read:volunteers", "read:audit",
    "approve:projects", "approve:donations"
  ],
  TESORERO: [
    "read:projects", "read:volunteers",
    "read:donations", "manage:donations"
  ],
  COORDINADOR: [
    "read:donations",
    "read:projects", "manage:projects",
    "read:volunteers", "manage:volunteers"
  ],
  AUDITOR: [
    "read:projects", "read:donations", "read:volunteers", "read:audit"
  ]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}
