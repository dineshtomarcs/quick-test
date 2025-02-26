import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

//import { ConfigService } from "../../shared/services/config.service";
import { UserReadService } from "../../service-users/user/services/read.service";
import { PermissionService } from "../../service-permission/permission.service";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "../../config/config.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService<AllConfigType>,
    public readonly userReadService: UserReadService,
    private readonly permissionService: PermissionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("app.jwtKey", { infer: true }),
    });
  }

  async validate({ iat, exp, id: userId }) {
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }
    const user = await this.userReadService.findUserById(
      userId,
      "organization",
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const permissions = (
      await this.permissionService.findAllPermissionsByRoleId(user.roleId)
    ).map((permission) => permission.permissionName);
    return { user, permissions };
  }
}
