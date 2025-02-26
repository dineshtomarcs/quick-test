import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserReadService } from "../../service-users/user/services/read.service";
import { OrgSubscriptionStatus } from "../../common/enums/org-subscription-status";
import { AuthService } from "../../service-auth/auth/auth.service";
import { OrganizationService } from "../organization/organization.service";

@Injectable()
export class CronService {
  constructor(
    private readonly authService: AuthService,
    public readonly userReadService: UserReadService,
    public readonly organizationService: OrganizationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCronJob() {
    const trialExpiredOrganizations =
      await this.organizationService.findTrialExpiredOrgs();
    trialExpiredOrganizations.forEach(async (org) => {
      await this.organizationService.updateOrgSubscriptionStatus(
        org.id,
        OrgSubscriptionStatus.cancelled,
      );
      const orgAdmin = await this.userReadService.getOrgAdminByOrgId(org.id);
      if (!orgAdmin) {
        return false;
      }
      await this.authService.sendUserFreeTrialExpiredMail(orgAdmin);
      return true;
    });
    const trialPeriodExpiringOrgs =
      await this.organizationService.findUpcomingTrialExpiringOrgs();
    trialPeriodExpiringOrgs?.forEach(async (org) => {
      const orgAdmin = await this.userReadService.getOrgAdminByOrgId(org.id);

      if (!orgAdmin) {
        return false;
      }
      await this.authService.sendUserFreeTrialExpiringMail(orgAdmin);
      return true;
    });
  }
}
