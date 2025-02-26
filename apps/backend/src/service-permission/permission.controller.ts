import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseSuccess } from "../common/dto/SuccessResponseDto";
import { ExceptionResponseFilter } from "../common/filters/exception-response.filter";
import { PermissionService } from "./permission.service";
import { AuthUser } from "../decorators/auth-user.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { UserEntity } from "../service-users/user/user.entity";

@Controller("permissions")
@ApiTags("auth")
@UseGuards(AuthGuard)
@UseFilters(ExceptionResponseFilter)
@ApiBearerAuth()
export class PermissionController {
  constructor(public readonly permissionService: PermissionService) {}

  /* Gets listing of permissions */

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns all the permissions",
  })
  @UseGuards(AuthGuard)
  async listPermissions(@AuthUser() user: UserEntity) {
    const permissions = await this.permissionService.findAllPermissionsByRoleId(
      user?.roleId,
    );
    return new ResponseSuccess("translations.PERMISSION_LIST", permissions);
  }
}
