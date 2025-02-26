import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserEntity } from "../service-users/user/user.entity";

@Injectable()
export class SubscriptionAuthGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const subscriptionAuthStatus = this._reflector.get<string[]>(
      "subscriptionAuthStatus",
      context.getHandler(),
    );

    if (!subscriptionAuthStatus?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user }: { user: UserEntity } = request.user;
    const { organization } = user;

    return subscriptionAuthStatus.includes(organization.subscriptionStatus);
  }
}
