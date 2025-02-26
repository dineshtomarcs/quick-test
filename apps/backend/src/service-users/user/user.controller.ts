import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  Param,
  Put,
  Body,
  UseFilters,
  UploadedFile,
  Post,
  Delete,
  Patch,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { AuthUserInterceptor } from "../../interceptors/auth-user-interceptor.service";
import { UsersPageDto } from "./dto/UsersPageDto";
import { UsersPageOptionsDto } from "./dto/UsersPageOptionsDto";
import { AuthUser } from "../../decorators/auth-user.decorator";
import { UserEntity } from "./user.entity";
import { ResponseSuccess } from "../../common/dto/SuccessResponseDto";
import { DashboardCountsDto } from "./dto/DashboardCountsDto";
import { UpdateUserDto, UpdateUserSwagger } from "./dto/UpdateUserDto";
import { UpdateUserStatusDto } from "./dto/UpdateUserStatusDto";
import { ChangePasswordDto } from "./dto/ChangePasswordDto";
import { ExceptionResponseFilter } from "../../common/filters/exception-response.filter";
import { UUIDCheckPipe } from "../../common/pipes/uuid-check.pipe";
import { IFile } from "../../interfaces/IFile";
import { UserReadService } from "./services/read.service";
import { UserUpdateService } from "./services/update.service";
import { PermissionsGuard } from "../../guards/permission.guard";
import { Permissions } from "../../decorators/permission.decorator";
import { Permission } from "../../common/constants/permissions";
import { UserDto } from "./dto/UserDto";
import { UserDeleteService } from "./services/delete.service";
import { SubscriptionAuthGuard } from "../../guards/org.subscription.guard";

@Controller("users")
@ApiTags("users")
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@UseFilters(ExceptionResponseFilter)
@ApiBearerAuth()
export class UserController {
  constructor(
    private _userReadService: UserReadService,
    private _userUpdateService: UserUpdateService,
    private _userDeleteService: UserDeleteService,
  ) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.GET_USERS)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get users list",
    type: UsersPageDto,
  })
  async getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<ResponseSuccess> {
    const users = await this._userReadService.getUsers(pageOptionsDto);
    return new ResponseSuccess("translations.LIST_USERS", users);
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.GET_USER)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get users list",
    type: UsersPageDto,
  })
  async getUser(
    @Param("id", UUIDCheckPipe) userId: string,
  ): Promise<ResponseSuccess> {
    const user = await this._userReadService.findUserById(userId);
    return new ResponseSuccess("translations.USERS_DETAILS", user?.toDto());
  }

  @Get("/dashboard-info")
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.GET_DASHBOARD_INFO)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get Counts for Project and Test cases",
    type: DashboardCountsDto,
  })
  async getCounts(@AuthUser() user: UserEntity): Promise<ResponseSuccess> {
    const counts = await this._userReadService.getCounts(user);
    return new ResponseSuccess("translations.USER_PROJECTS_TESTCASES", counts);
  }

  @Put("/update-password")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: "Password changed successfully",
  })
  async changePassword(
    @Body() passwordUpdateDto: ChangePasswordDto,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const status = await this._userUpdateService.changePassword(
      passwordUpdateDto,
      user,
    );
    return new ResponseSuccess(`translations.PASSWORD_UPDATED`, {
      status,
    });
  }

  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.UPDATE_USER)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update my Profile",
    type: UpdateUserDto,
  })
  @ApiBody({ type: UpdateUserSwagger })
  async updateUser(
    @Body("user")
    updateUser: UpdateUserDto,
    @Body("organization") newOrganizationName: string,
    @Param("id", UUIDCheckPipe) userId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const updateStatus = await this._userUpdateService.updateUser(
      updateUser,
      newOrganizationName,
      {
        id: userId,
      },
      user,
    );
    return new ResponseSuccess("translations.PROFILE_UPDATED", updateStatus);
  }

  /*
   *  Update user status: active/inactive
   */
  @Put("/:id/status")
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Permissions(Permission.UPDATE_USER_STATUS)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update user status",
    type: UpdateUserStatusDto,
  })
  async updateUserStatus(
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Param("id", UUIDCheckPipe) userId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const updatedUser = await this._userUpdateService.updateUserStatus(
      updateUserStatusDto,
      {
        id: userId,
      },
      user,
    );
    return new ResponseSuccess(
      "translations.USER_STATUS_UPDATED",
      updatedUser.toDto(),
    );
  }

  /**
   * Upload user's profile picture
   */
  @Post("/profile-picture")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 1e7 }, // payload size limit 10 MB
    }),
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update user profile picture",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadUserProfilePicture(
    @UploadedFile() file: IFile,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const status = await this._userUpdateService.uploadUserProfilePicture(
      file,
      user,
    );
    return new ResponseSuccess(
      "translations.PROFILE_PICTURE_UPLOADED",
      status.toDto(),
    );
  }

  /*
   *  Archive a user
   */

  @Delete("/:id/archive")
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Permissions(Permission.ARCHIVE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Archive a user",
    type: UserDto,
  })
  async archiveUser(
    @Param("id", UUIDCheckPipe) userId: string,
    @AuthUser() currentLoggedinUser: UserEntity,
  ): Promise<ResponseSuccess> {
    const archiveUser = await this._userDeleteService.archiveUser(
      userId,
      currentLoggedinUser,
    );
    return new ResponseSuccess("translations.USER_ARCHIVED", archiveUser);
  }

  /**
   * Reactivate a user
   */

  @Patch("/:id/reactivate")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.REACTIVATE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Reactivate a user",
    type: UserDto,
  })
  async reactivateUser(
    @Param("id", UUIDCheckPipe) userId: string,
    @AuthUser() currentLoggedinUser: UserEntity,
  ): Promise<ResponseSuccess> {
    await this._userUpdateService.reactivateUser(userId, currentLoggedinUser);
    return new ResponseSuccess("translations.USER_REACTIVATED", { userId });
  }

  /*
   *  Delete a user
   */

  @Delete("/:id/delete")
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Permissions(Permission.DELETE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete a user",
    type: UserDto,
  })
  async deleteUser(
    @Param("id", UUIDCheckPipe) userId: string,
    @AuthUser() currentLoggedinUser: UserEntity,
  ): Promise<ResponseSuccess> {
    const deleteUser = await this._userDeleteService.deleteUser(
      userId,
      currentLoggedinUser,
    );
    return new ResponseSuccess("translations.USER_DELETED", deleteUser);
  }
}
