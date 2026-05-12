import { IDonationRepository } from "../domain/Donation";

export class GetGrantsUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute() {
    return this.donationRepository.getAll({ type: "GRANT" });
  }
}
