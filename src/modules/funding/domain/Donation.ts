export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: Date;
  projectId?: string;
  locale: string;
  stripeSessionId?: string | null;
  isRecurring: boolean;
  type: string;           // "DONATION" | "GRANT"
  donorEmail?: string | null;
  notes?: string | null;
  currency: string;
  isRestricted: boolean;
  funderOrg?: string | null;
}

export interface IDonationRepository {
  create(donation: Omit<Donation, "id" | "date">): Promise<Donation>;
  getAll(filters?: { projectId?: string; startDate?: Date; endDate?: Date; type?: string }): Promise<Donation[]>;
  findByStripeSessionId(sessionId: string): Promise<Donation | null>;
}
