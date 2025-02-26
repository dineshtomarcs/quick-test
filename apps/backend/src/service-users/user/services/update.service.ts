import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AwsS3Service } from "../../../shared/services/aws-s3.service";
import { ValidatorService } from "../../../shared/services/validator.service";
import { UserEntity } from "../user.entity";

import { OrganizationService } from "../../../service-organization/organization/organization.service";
import { UpdateUserDto } from "../dto/UpdateUserDto";
import { ChangePasswordDto } from "../dto/ChangePasswordDto";
import { UtilsService } from "../../../_helpers/utils.service";

import { AuthService } from "../../../service-auth/auth/auth.service";
import { UpdateUserStatusDto } from "../dto/UpdateUserStatusDto";
import { UpdateOrganizationMemberDto } from "../../../service-organization/organization/dto/UpdateOrganizationMemberDto";

import { AppConfigService } from "../../../shared/services/app.config.service";
import { ExpectationFailedException } from "../../../exceptions/expectation-failed.exception";
import { IFile } from "../../../interfaces/IFile";
import { UserReadService } from "./read.service";
import { RoleService } from "../../../service-role/role.service";
import { RoleId } from "../../../common/enums/role-id";
import { UserDto } from "../dto/UserDto";
import { ForgottenPasswordEntity } from "../forgotten-password-reqs.entity";
import { EmailVerifyTokenEntity } from "../email-verify-token.entity";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "../../../config/config.type";

@Injectable()
export class UserUpdateService {
  private static readonly MILLIS_TO_MINUTES = 60000;

  private static readonly TOKEN_EXPIRY_IN_MINS = 1440; // valid for day

  public authService: AuthService;

  public appconfigService: AppConfigService;

  public userReadService: UserReadService;

  public organizationService: OrganizationService;

  constructor(
    private readonly roleService: RoleService,
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
    public readonly validatorService: ValidatorService,
    public readonly awsS3Service: AwsS3Service,
    public readonly moduleRef: ModuleRef,
    @InjectRepository(ForgottenPasswordEntity)
    private readonly forgottenPasswordRepository: Repository<ForgottenPasswordEntity>,
    @InjectRepository(EmailVerifyTokenEntity)
    private readonly emailVerifyTokenRepository: Repository<EmailVerifyTokenEntity>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  onModuleInit(): void {
    this.authService = this.moduleRef.get(AuthService, {
      strict: false,
    });
    this.organizationService = this.moduleRef.get(OrganizationService, {
      strict: false,
    });
    this.appconfigService = this.moduleRef.get(AppConfigService, {
      strict: false,
    });
    this.userReadService = this.moduleRef.get(UserReadService, {
      strict: false,
    });
  }

  async updateUser(
    data: Partial<UpdateUserDto>,
    newOrganizationName: string,
    identity: Partial<{ email: string; id: string }>,
    currentLoggedInUser?: UserEntity,
  ): Promise<boolean> {
    if (
      currentLoggedInUser.roleId === RoleId.MEMBER &&
      identity?.id !== currentLoggedInUser.id
    ) {
      throw new ForbiddenException("translations.NO_UPDATE_PERMISSION");
    }
    const updateDoc: any = {};
    Object.assign(updateDoc, data);
    if (newOrganizationName && currentLoggedInUser.roleId !== RoleId.MEMBER) {
      await this.organizationService.changeOrganizationName(
        currentLoggedInUser.organization.id,
        newOrganizationName,
        currentLoggedInUser,
      );
    }

    if (data?.firstName)
      updateDoc.firstName = UtilsService.properCase(data.firstName);
    if (data?.lastName)
      updateDoc.lastName = UtilsService.properCase(data.lastName);
    if (data?.country)
      updateDoc.country = UtilsService.properCase(data.country);
    if (data?.state) updateDoc.state = UtilsService.properCase(data.state);
    if (data.city) updateDoc.city = UtilsService.properCase(data.city);

    let userId = currentLoggedInUser.id;
    if (identity?.id) userId = identity?.id;
    const updateResult = await this.userRepository.update(
      { id: userId },
      updateDoc,
    );
    if (!updateResult.affected)
      throw new NotFoundException("translations.RECORD_NOT_FOUND");

    const checkAddressUpdate =
      updateDoc.country ||
      updateDoc.state ||
      updateDoc.city ||
      updateDoc.postalCode ||
      updateDoc.address1 ||
      updateDoc.address2;
    if (!checkAddressUpdate) return true;
    return true;
  }

  /**
   * Verify user email using token
   */
  async verifyUserEmail(token: string): Promise<boolean> {
    if (!token) throw new BadRequestException("translations.TOKEN_REQUIRED");

    const emailVerifyToken = await this.emailVerifyTokenRepository
      .createQueryBuilder("emailVerifyToken")
      .where("emailVerifyToken.token = :token", { token })
      .getOne();
    if (!emailVerifyToken)
      throw new BadRequestException("translations.INVALID_TOKEN");

    const emailVerifyTokenExpirationTime =
      this.configService.get("email.emailVerifyTokenExpirationTime", {
        infer: true,
      }) * UserUpdateService.MILLIS_TO_MINUTES;
    const checkTokenExpired =
      emailVerifyToken.timestamp.getTime() + emailVerifyTokenExpirationTime <=
      new Date().getTime();
    if (emailVerifyToken && checkTokenExpired)
      throw new ForbiddenException("translations.INVALID_TOKEN");
    const res = await this.userRepository.update(
      {
        email: emailVerifyToken.email,
      },
      {
        isVerified: true,
      },
    );
    if (!res.affected)
      throw new NotFoundException("translations.RECORD_NOT_FOUND");
    await this.emailVerifyTokenRepository.delete({
      email: emailVerifyToken.email,
    });
    return true;
  }

  /**
   * Reset password via Dynamic token
   */
  async resetPassword(newPassword: string, token: string): Promise<boolean> {
    if (!newPassword && !token)
      throw new BadRequestException("translations.TOKEN_REQUIRED");

    const forgottenPasswordData = await this.forgottenPasswordRepository
      .createQueryBuilder("forgottenPasswordRequests")
      .where("forgottenPasswordRequests.token = :token", { token })
      .getOne();
    if (!forgottenPasswordData)
      throw new ForbiddenException("translations.INVALID_TOKEN");

    const checkTokenExpired =
      forgottenPasswordData.timestamp.getTime() +
        UserUpdateService.TOKEN_EXPIRY_IN_MINS *
          UserUpdateService.MILLIS_TO_MINUTES <=
      new Date().getTime();
    if (forgottenPasswordData && checkTokenExpired)
      throw new ForbiddenException("translations.INVALID_TOKEN");

    const checkUpdate = await this.updatePassword(
      forgottenPasswordData.email,
      newPassword,
    );
    if (checkUpdate) {
      await this.forgottenPasswordRepository.delete({
        email: forgottenPasswordData.email,
      });
    }
    return checkUpdate;
  }

  /**
   * Logged in user Only
   */
  async changePassword(
    changePasswordRequest: ChangePasswordDto,
    currentLoggedInUser: UserEntity,
  ): Promise<boolean> {
    const { oldPassword, newPassword } = changePasswordRequest;
    if (oldPassword === newPassword)
      throw new BadRequestException("translations.NEW_PASSWORD_EQUAL_OLD");
    const isPasswordValid = await UtilsService.validateHash(
      oldPassword,
      currentLoggedInUser.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException("translations.INCORRECT_OLD_PASSWORD");
    const res = await this.updatePassword(
      currentLoggedInUser.email,
      newPassword,
    );
    if (res) return true;
    throw new ExpectationFailedException("translations.RECORD_UPDATE_FAILED");
  }

  /**
   * Internal method to update user account password by Email and password string
   */
  async updatePassword(
    requestedEmail: string,
    newPassword: string,
  ): Promise<boolean> {
    const email = requestedEmail?.trim().toLowerCase();
    if (!email || !newPassword)
      throw new BadRequestException("translations.ACTION_FAILED");
    const checkUpdate = await this.userRepository.update(
      {
        email,
      },
      {
        password: newPassword,
      },
    );
    if (!checkUpdate.affected)
      throw new ExpectationFailedException("translations.RECORD_UPDATE_FAILED");
    return true;
  }

  /*
   * Update user status: active/inactive
   */
  async updateUserStatus(
    updateUserStatusDto: UpdateUserStatusDto,
    identity: {
      id: string;
    },
    currentLoggedInUser: UserEntity,
  ): Promise<UserEntity> {
    if (typeof updateUserStatusDto.status !== "boolean") {
      throw new BadRequestException("translations.INCORRECT_STATUS_TYPE");
    }
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: identity?.id })
      .getOne();
    if (!user) throw new NotFoundException("translations.RECORD_NOT_FOUND");

    const checkNullOrganization = user.organization_id;
    const checkSameOrganization =
      user.organization_id === currentLoggedInUser.organization_id;
    if (!checkNullOrganization || !checkSameOrganization) {
      throw new ForbiddenException("translations.NO_UPDATE_PERMISSION");
    }
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  /**
   * Internal method to update user
   */
  async updateMemberInOrganization(
    updateOrganizationMemberDto: UpdateOrganizationMemberDto,
    userId: string,
    currentLoggedInUser: UserEntity,
    lang: string,
  ): Promise<UserEntity> {
    const user = await this.userReadService.findOne({ id: userId });
    if (!user) throw new NotFoundException("translations.RECORD_NOT_FOUND");
    const checkSameOrganization =
      user.organization_id === currentLoggedInUser.organization_id;
    if (!checkSameOrganization || user.roleId < currentLoggedInUser.roleId)
      throw new ForbiddenException("translations.NO_UPDATE_PERMISSION");
    if (updateOrganizationMemberDto?.firstName) {
      user.firstName = UtilsService.properCase(
        updateOrganizationMemberDto.firstName,
      );
    }
    if (updateOrganizationMemberDto?.lastName) {
      user.lastName = UtilsService.properCase(
        updateOrganizationMemberDto.lastName,
      );
    }
    if (updateOrganizationMemberDto?.title) {
      user.title = UtilsService.properCase(updateOrganizationMemberDto.title);
    }

    if (
      updateOrganizationMemberDto?.roleId &&
      currentLoggedInUser.roleId === RoleId.ORGADMIN
    ) {
      user.role = await this.roleService.findRoleById(
        updateOrganizationMemberDto.roleId,
      );
    }

    let updatedUser = await this.userRepository.save(user);

    if (
      updateOrganizationMemberDto?.email &&
      currentLoggedInUser.roleId === RoleId.ORGADMIN
    ) {
      updatedUser = await this.updateUserEmail(
        user.email,
        updateOrganizationMemberDto.email,
        lang,
      );
    }
    return updatedUser;
  }

  /**
   * Internal method to update email of the user
   */
  async updateUserEmail(
    oldEmail: string,
    newEmail: string,
    lang: string,
  ): Promise<UserEntity> {
    oldEmail = UtilsService.lowerCase(oldEmail);
    newEmail = UtilsService.lowerCase(newEmail);

    const user = await this.userRepository.findOneBy({ email: oldEmail });
    if (!user) throw new NotFoundException("translations.RECORD_NOT_FOUND");

    const checkSameEmail = oldEmail === newEmail;
    if (checkSameEmail)
      throw new ConflictException("translations.NEW_EMAIL_EQUAL_OLD");

    const checkEmailExists = await this.userRepository.findOneBy({
      email: newEmail,
    });
    if (checkEmailExists && oldEmail !== newEmail) {
      throw new ConflictException("translations.DUPLICATE_EMAIL");
    }

    const randomPassword = UtilsService.generateRandomString(9);
    user.password = UtilsService.generateHash(randomPassword);
    user.email = newEmail;

    const updatedUser = await this.userRepository.save(user);
    this.authService.sendResetPasswordLink({ email: user.email }, lang);
    return updatedUser;
  }

  /**
   * Upload user's profile picture
   */
  async uploadUserProfilePicture(
    file: IFile,
    currentLoggedInUser: UserEntity,
  ): Promise<UserEntity> {
    if (!file) throw new BadRequestException("translations.FILE_REQUIRED");
    const checkImageType = this.validatorService.isImage(file?.mimetype);
    if (!checkImageType)
      throw new BadRequestException("translations.INVALID_IMAGE_TYPE");

    const key = await this.awsS3Service.uploadImage(file);
    if (!key || !key?.Location)
      throw new ExpectationFailedException("translations.ACTION_FAILED");

    currentLoggedInUser.profileImage = key?.Location;
    await this.userRepository.save(currentLoggedInUser);
    return currentLoggedInUser;
  }

  /** **** Reactivate a user */

  async reactivateUser(
    userId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      withDeleted: true,
    });
    const checkSameOrganization =
      user.organization_id === currentLoggedInUser.organization_id;
    if (!checkSameOrganization || user.roleId < currentLoggedInUser.roleId)
      throw new ForbiddenException("translations.NO_UPDATE_PERMISSION");
    if (!user) throw new NotFoundException("translations.RECORD_NOT_FOUND");
    user.archived_by = null;
    await this.userRepository.save(user);
    await this.userRepository.recover(user);
    return user.toDto();
  }
}
