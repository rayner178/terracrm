export interface Project {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  status: string; // "PLANNING", "ACTIVE", "COMPLETED"
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  create(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project>;
  updateStatus(id: string, status: string): Promise<Project>;
}
