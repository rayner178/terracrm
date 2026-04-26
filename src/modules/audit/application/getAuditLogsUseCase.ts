import { IAuditLogRepository, AuditLog, AuditEntity } from "../domain/AuditLog";

export class GetAuditLogsUseCase {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  async execute(filters?: { userId?: string; entity?: string; startDate?: string; endDate?: string }): Promise<AuditLog[]> {
    const parsedFilters: any = {};
    if (filters?.userId) parsedFilters.userId = filters.userId;
    if (filters?.entity) parsedFilters.entity = filters.entity as AuditEntity;
    if (filters?.startDate) parsedFilters.startDate = new Date(filters.startDate);
    if (filters?.endDate) parsedFilters.endDate = new Date(filters.endDate);
    
    return await this.auditLogRepository.getAll(parsedFilters);
  }
}
