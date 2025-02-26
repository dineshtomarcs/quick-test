import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserReadService } from "../service-users/user/services/read.service";
import { UserEntity } from "../service-users/user/user.entity";
import { RoleId } from "../common/enums/role-id";
@Injectable()
export class ProjectAuthGuard implements CanActivate {
  constructor(private readonly readService: UserReadService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user }: { user: UserEntity } = request.user;
    if (user.roleId != RoleId.MEMBER) return true;

    const count: boolean = await this.readService.checkProjectAccess(
      request.params.id,
      user.id,
    );
    return count;
  }
}
