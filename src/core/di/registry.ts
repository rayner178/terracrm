import { PrismaVolunteerRepository } from "@/modules/volunteers/infrastructure/prismaVolunteerRepository";
import { GetVolunteersUseCase } from "@/modules/volunteers/application/getVolunteersUseCase";
import { CreateVolunteerUseCase } from "@/modules/volunteers/application/createVolunteerUseCase";

import { PrismaProjectRepository } from "@/modules/projects/infrastructure/prismaProjectRepository";
import { GetProjectsUseCase } from "@/modules/projects/application/getProjectsUseCase";
import { CreateProjectUseCase } from "@/modules/projects/application/createProjectUseCase";
import { GetProjectByIdUseCase } from "@/modules/projects/application/getProjectByIdUseCase";
import { AssignVolunteerUseCase } from "@/modules/projects/application/assignVolunteerUseCase";
import { CreateMilestoneUseCase } from "@/modules/projects/application/createMilestoneUseCase";
import { ToggleMilestoneUseCase } from "@/modules/projects/application/toggleMilestoneUseCase";
import { DeleteMilestoneUseCase } from "@/modules/projects/application/deleteMilestoneUseCase";
import { PrismaMilestoneRepository } from "@/modules/projects/infrastructure/prismaMilestoneRepository";

import { PrismaDonationRepository } from "@/modules/funding/infrastructure/prismaDonationRepository";
import { GetDonationsUseCase } from "@/modules/funding/application/getDonationsUseCase";
import { CreateDonationUseCase } from "@/modules/funding/application/createDonationUseCase";
import { GetGrantsUseCase } from "@/modules/funding/application/getGrantsUseCase";
import { CreateGrantUseCase } from "@/modules/funding/application/createGrantUseCase";

import { GetGeneralImpactUseCase } from "@/modules/reports/application/getGeneralImpactUseCase";

import { PrismaAuditLogRepository } from "@/modules/audit/infrastructure/PrismaAuditLogRepository";
import { GetAuditLogsUseCase } from "@/modules/audit/application/getAuditLogsUseCase";

import { PrismaImpactRepository } from "@/modules/impact/infrastructure/PrismaImpactRepository";
import { DefineMetricUseCase } from "@/modules/impact/application/defineMetricUseCase";
import { RecordMetricUseCase } from "@/modules/impact/application/recordMetricUseCase";
import { GetImpactDashboardUseCase } from "@/modules/impact/application/getImpactDashboardUseCase";

import { CreateCheckoutSessionUseCase } from "@/modules/payments/application/createCheckoutSessionUseCase";
import { HandleStripeWebhookUseCase } from "@/modules/payments/application/handleStripeWebhookUseCase";

import { GetInstitutionalReportDataUseCase } from "@/modules/reports/application/getInstitutionalReportDataUseCase";
import { GetPublicTransparencyDataUseCase } from "@/modules/reports/application/getPublicTransparencyDataUseCase";
import { GetProjectsGISUseCase } from "@/modules/projects/application/getProjectsGISUseCase";
import { ParseXlsxUseCase } from "@/modules/imports/application/parseXlsxUseCase";
import { ImportDataUseCase } from "@/modules/imports/application/importDataUseCase";

class Registry {
  // Repositories
  private _volunteerRepo?: PrismaVolunteerRepository;
  private _projectRepo?: PrismaProjectRepository;
  private _donationRepo?: PrismaDonationRepository;
  private _auditLogRepo?: PrismaAuditLogRepository;
  private _impactRepo?: PrismaImpactRepository;
  private _milestoneRepo?: PrismaMilestoneRepository;

  // Volunteer Module
  get volunteerRepository() {
    if (!this._volunteerRepo) this._volunteerRepo = new PrismaVolunteerRepository();
    return this._volunteerRepo;
  }
  get getVolunteersUseCase() { return new GetVolunteersUseCase(this.volunteerRepository); }
  get createVolunteerUseCase() { return new CreateVolunteerUseCase(this.volunteerRepository); }

  // Project Module
  get projectRepository() {
    if (!this._projectRepo) this._projectRepo = new PrismaProjectRepository();
    return this._projectRepo;
  }
  get getProjectsUseCase() { return new GetProjectsUseCase(this.projectRepository); }
  get createProjectUseCase() { return new CreateProjectUseCase(this.projectRepository); }
  get getProjectByIdUseCase() { return new GetProjectByIdUseCase(this.projectRepository); }
  get assignVolunteerUseCase() { return new AssignVolunteerUseCase(this.projectRepository); }

  // Milestone Module
  get milestoneRepository() {
    if (!this._milestoneRepo) this._milestoneRepo = new PrismaMilestoneRepository();
    return this._milestoneRepo;
  }
  get createMilestoneUseCase() { return new CreateMilestoneUseCase(this.milestoneRepository); }
  get toggleMilestoneUseCase() { return new ToggleMilestoneUseCase(this.milestoneRepository); }
  get deleteMilestoneUseCase() { return new DeleteMilestoneUseCase(this.milestoneRepository); }

  // Funding Module
  get donationRepository() {
    if (!this._donationRepo) this._donationRepo = new PrismaDonationRepository();
    return this._donationRepo;
  }
  get getDonationsUseCase() { return new GetDonationsUseCase(this.donationRepository); }
  get createDonationUseCase() { return new CreateDonationUseCase(this.donationRepository); }
  get getGrantsUseCase() { return new GetGrantsUseCase(this.donationRepository); }
  get createGrantUseCase() { return new CreateGrantUseCase(this.donationRepository); }

  // Reports Module
  get getGeneralImpactUseCase() {
    return new GetGeneralImpactUseCase(
      this.projectRepository,
      this.donationRepository,
      this.volunteerRepository
    );
  }

  // Audit Module
  get auditLogRepository() {
    if (!this._auditLogRepo) this._auditLogRepo = new PrismaAuditLogRepository();
    return this._auditLogRepo;
  }
  get getAuditLogsUseCase() { return new GetAuditLogsUseCase(this.auditLogRepository); }

  // Impact Module
  get impactRepository() {
    if (!this._impactRepo) this._impactRepo = new PrismaImpactRepository();
    return this._impactRepo;
  }
  get defineMetricUseCase() { return new DefineMetricUseCase(this.impactRepository); }
  get recordMetricUseCase() { return new RecordMetricUseCase(this.impactRepository); }
  get getImpactDashboardUseCase() { return new GetImpactDashboardUseCase(this.impactRepository); }

  // Payments Module
  get createCheckoutSessionUseCase() { return new CreateCheckoutSessionUseCase(); }
  get handleStripeWebhookUseCase() { return new HandleStripeWebhookUseCase(this.donationRepository); }

  // Reports Module
  get getInstitutionalReportDataUseCase() { 
    return new GetInstitutionalReportDataUseCase(
      this.donationRepository,
      this.impactRepository
    ); 
  }
  get getPublicTransparencyDataUseCase() {
    return new GetPublicTransparencyDataUseCase(
      this.donationRepository,
      this.impactRepository
    );
  }
  get getProjectsGISUseCase() {
    return new GetProjectsGISUseCase();
  }

  // Import Module
  get parseXlsxUseCase() { return new ParseXlsxUseCase(); }
  get importDataUseCase() {
    return new ImportDataUseCase(
      this.volunteerRepository,
      this.projectRepository,
      this.donationRepository
    );
  }
}

export const container = new Registry();
