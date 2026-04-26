export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type AuditEntity = 'DONATION' | 'PROJECT' | 'VOLUNTEER';

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  changes: any;
  ipAddress?: string;
  createdAt: Date;
}

export interface IAuditLogRepository {
  create(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog>;
  getAll(filters?: { userId?: string; entity?: AuditEntity; startDate?: Date; endDate?: Date }): Promise<AuditLog[]>;
}
