import { ApiPropertyOptional } from "@nestjs/swagger";
import { RoleEntity } from "../../../service-role/role.entity";
import { AbstractDto } from "../../../common/dto/AbstractDto";

import { UserEntity } from "../user.entity";

export class UserDto extends AbstractDto {
  @ApiPropertyOptional()
  firstName: string;

  @ApiPropertyOptional()
  lastName: string;

  @ApiPropertyOptional()
  address1: string;

  @ApiPropertyOptional()
  address2: string;

  @ApiPropertyOptional()
  state: string;

  @ApiPropertyOptional()
  city: string;

  @ApiPropertyOptional()
  country: string;

  @ApiPropertyOptional()
  postalCode: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  profileImage: string;

  @ApiPropertyOptional()
  organization: string;

  @ApiPropertyOptional()
  subscriptionStatus: string;

  @ApiPropertyOptional()
  freeTrialStartDate: Date;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  isVerified: boolean;

  @ApiPropertyOptional()
  language: string;

  @ApiPropertyOptional()
  role: RoleEntity;

  @ApiPropertyOptional()
  roleId: RoleEntity["id"];

  @ApiPropertyOptional()
  deletedAt: Date;

  archivedByUser!: UserEntity;

  constructor(user: UserEntity) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.address1 = user.address1;
    this.address2 = user.address2;
    this.city = user.city;
    this.country = user.country;
    this.state = user.state;
    this.postalCode = user.postalCode;
    this.organization = user.organization ? user.organization.name : "N/A";
    this.subscriptionStatus = user.organization
      ? user.organization.subscriptionStatus
      : "N/A";
    this.freeTrialStartDate = user.organization
      ? user.organization.freeTrialStartDate
      : null;
    this.profileImage = user.profileImage;
    this.phone = user.phone;
    this.title = user.title;
    this.isVerified = user.isVerified;
    this.language = user.language;
    this.roleId = user.roleId;
    this.role = user.role;
    this.deletedAt = user.deletedAt;
    this.archivedByUser = user.archivedByUser ? user.archivedByUser : null;
  }
}
