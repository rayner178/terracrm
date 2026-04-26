export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  skills: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVolunteerRepository {
  getAll(page?: number, limit?: number): Promise<{ data: Volunteer[], total: number }>;
  create(data: Omit<Volunteer, "id" | "createdAt" | "updatedAt">): Promise<Volunteer>;
}
