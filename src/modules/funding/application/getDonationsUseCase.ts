import { IDonationRepository } from "../domain/Donation";

export class GetDonationsUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute() {
    return await this.donationRepository.getAll();
  }
}
