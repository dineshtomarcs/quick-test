import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUser } from "../decorators/auth-user.decorator";
import { UserEntity } from "../service-users/user/user.entity";
import { ResponseSuccess } from "../common/dto/SuccessResponseDto";
import { ExceptionResponseFilter } from "../common/filters/exception-response.filter";
import { CreateRoleDto, createRoleSwagger } from "./role.dto";
import { AuthGuard } from "../guards/auth.guard";
import { RoleService } from "./role.service";

@Controller("roles")
@ApiTags("roles")
@UseFilters(ExceptionResponseFilter)
@ApiBearerAuth()
export class RoleController {
  constructor(public readonly roleService: RoleService) {}

  /**
   * creating a role
   */

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "New role created",
  })
  @ApiBody({ type: createRoleSwagger })
  async createRole(
    @Body("roleType") roleType: string,
  ): Promise<ResponseSuccess> {
    const response = await this.roleService.createRole(roleType);

    return new ResponseSuccess("tranlations.NEW_ROLE_CREATED", response);
  }

  /* Internal API for user that finds the role he can add */

  @Get("/role")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Find role adding permission",
  })
  @UseGuards(AuthGuard)
  async getRoleToAdd(@AuthUser() user: UserEntity): Promise<ResponseSuccess> {
    const response = await this.roleService.findRolesToAdd(user);
    return new ResponseSuccess("", response);
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Find role by ID",
    type: CreateRoleDto,
  })
  async getRoleById(@Param("id") roleId: number): Promise<ResponseSuccess> {
    const response = await this.roleService.findRoleById(roleId);
    return new ResponseSuccess("translations.ROLE_DETAILS ", response);
  }
}
