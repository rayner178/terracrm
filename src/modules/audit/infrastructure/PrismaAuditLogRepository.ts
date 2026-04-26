import { prisma } from "@/infrastructure/database/prisma";
import { IAuditLogRepository, AuditLog, AuditEntity } from "../domain/AuditLog";
import { AuditLogMapper } from "./AuditLogMapper";

export class PrismaAuditLogRepository implements IAuditLogRepository {
  async create(log: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
    const raw = await prisma.auditLog.create({
      data: {
        userId: log.userId,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        changes: log.changes || {},
        ipAddress: log.ipAddress,
      },
    });
    return AuditLogMapper.toDomain(raw);
  }

  async getAll(filters?: { userId?: string; entity?: AuditEntity; startDate?: Date; endDate?: Date }): Promise<AuditLog[]> {
    const where: any = {};
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.entity) where.entity = filters.entity;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const rawLogs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return rawLogs.map(AuditLogMapper.toDomain);
  }
}
