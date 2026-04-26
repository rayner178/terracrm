import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { container } from "@/core/di/registry";
import { AuditAction, AuditEntity } from "@/modules/audit/domain/AuditLog";
import { Role } from "@prisma/client";
import { hasPermission, Permission } from "./permissions";

interface AuditConfig {
  action: AuditAction;
  entity: AuditEntity;
  requiredPermission?: Permission;
}

export function withAuditLog(config: AuditConfig, handler: (formData: FormData, session: any) => Promise<any>) {
  return async (formData: FormData) => {
    "use server";
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("No autorizado");
    }

    const role = (session.user as any).role as Role;
    if (config.requiredPermission && !hasPermission(role, config.requiredPermission)) {
      throw new Error(`Permisos insuficientes. Se requiere: ${config.requiredPermission}`);
    }

    // Extraer datos del formData para loggear (excluir datos muy sensibles si hubiera)
    const changes: Record<string, any> = {};
    formData.forEach((value, key) => {
      changes[key] = value;
    });

    try {
      const result = await handler(formData, session);
      
      // Registrar éxito
      await container.auditLogRepository.create({
        userId: (session.user as any).id,
        action: config.action,
        entity: config.entity,
        entityId: result?.id || "unknown",
        changes: { success: true, payload: changes },
      });

      return result;
    } catch (error: any) {
      // Registrar fallo si se desea
      await container.auditLogRepository.create({
        userId: (session.user as any).id,
        action: config.action,
        entity: config.entity,
        entityId: "failed",
        changes: { success: false, payload: changes, error: error.message },
      });
      throw error;
    }
  };
}
