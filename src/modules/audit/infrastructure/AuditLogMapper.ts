import { AuditLog as PrismaAuditLog } from "@prisma/client";
import { AuditLog, AuditAction, AuditEntity } from "../domain/AuditLog";

export class AuditLogMapper {
  static toDomain(raw: PrismaAuditLog): AuditLog {
    return {
      id: raw.id,
      userId: raw.userId,
      action: raw.action as AuditAction,
      entity: raw.entity as AuditEntity,
      entityId: raw.entityId,
      changes: raw.changes,
      ipAddress: raw.ipAddress || undefined,
      createdAt: raw.createdAt,
    };
  }
}
