import { CreateDonationUseCase } from "../createDonationUseCase";
import { IDonationRepository } from "../../domain/Donation";
import { ValidationError } from "@/core/errors/DomainError";

describe("CreateDonationUseCase", () => {
  let mockRepo: jest.Mocked<IDonationRepository>;
  let useCase: CreateDonationUseCase;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      getAll: jest.fn(),
    };
    useCase = new CreateDonationUseCase(mockRepo);
  });

  it("should create a donation when data is valid", async () => {
    const validData = { donorName: "John Doe", amount: 100 };
    mockRepo.create.mockResolvedValue({ id: "1", ...validData, date: new Date(), projectId: null });

    const result = await useCase.execute(validData);

    expect(result.donorName).toBe("John Doe");
    expect(mockRepo.create).toHaveBeenCalledWith({
      donorName: "John Doe",
      amount: 100,
      projectId: undefined,
      currency: "USD",
      donorEmail: null,
      funderOrg: null,
      isRecurring: false,
      isRestricted: false,
      locale: "es",
      notes: null,
      type: "DONATION",
    });
  });

  it("should throw ValidationError when amount is negative", async () => {
    const invalidData = { donorName: "John Doe", amount: -100 };

    await expect(useCase.execute(invalidData)).rejects.toThrow(ValidationError);
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
