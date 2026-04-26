export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: Date;
  projectId?: string;
  locale: string;
  stripeSessionId?: string | null;
  isRecurring: boolean;
}

export interface IDonationRepository {
  create(donation: Omit<Donation, "id" | "date">): Promise<Donation>;
  getAll(filters?: { projectId?: string; startDate?: Date; endDate?: Date }): Promise<Donation[]>;
  findByStripeSessionId(sessionId: string): Promise<Donation | null>;
}
