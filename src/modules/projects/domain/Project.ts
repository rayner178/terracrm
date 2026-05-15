export interface Project {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  ecosystemType: string | null;
  status: string; // "PLANNING", "ACTIVE", "COMPLETED"
  budget: number | null;
  spent: number | null;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  coordinatorId: string | null;
}

export interface ProjectDetail extends Project {
  coordinator: { id: string; name: string | null; email: string } | null;
  assignments: {
    id: string;
    hoursWorked: number;
    volunteer: { id: string; firstName: string; lastName: string; email: string };
  }[];
  donations: {
    id: string;
    donorName: string;
    amount: number;
    date: Date;
    type: string;
  }[];
  metricRecords: {
    id: string;
    value: number;
    date: Date;
    metric: { id: string; name: string; unit: string };
  }[];
  milestones: {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    status: string;
    createdAt: Date;
  }[];
}

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  getById(id: string): Promise<ProjectDetail | null>;
  create(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project>;
  updateStatus(id: string, status: string): Promise<Project>;
  updateCoordinator(id: string, coordinatorId: string): Promise<Project>;
  assignVolunteer(projectId: string, volunteerId: string, hoursWorked?: number): Promise<void>;
}
