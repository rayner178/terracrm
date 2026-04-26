import { Volunteer as PrismaVolunteer } from "@prisma/client";
import { Volunteer } from "../domain/Volunteer";

export class VolunteerMapper {
  static toDomain(prismaVolunteer: PrismaVolunteer): Volunteer {
    return {
      id: prismaVolunteer.id,
      firstName: prismaVolunteer.firstName,
      lastName: prismaVolunteer.lastName,
      email: prismaVolunteer.email,
      phone: prismaVolunteer.phone,
      skills: prismaVolunteer.skills,
      createdAt: prismaVolunteer.createdAt,
      updatedAt: prismaVolunteer.updatedAt,
    };
  }
}
