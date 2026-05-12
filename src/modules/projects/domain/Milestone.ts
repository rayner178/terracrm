export interface Milestone {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: string; // "PENDING" | "COMPLETED"
  projectId: string;
  createdAt: Date;
}

export interface IMilestoneRepository {
  getByProjectId(projectId: string): Promise<Milestone[]>;
  create(data: Omit<Milestone, "id" | "createdAt">): Promise<Milestone>;
  updateStatus(id: string, status: string): Promise<Milestone>;
  delete(id: string): Promise<void>;
}
