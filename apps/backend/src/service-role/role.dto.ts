import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { RoleType } from "../common/enums/role-type";

export class CreateRoleDto {
  @ApiProperty()
  @IsEnum(() => RoleType)
  roleType?: () => RoleType;
}

export class createRoleSwagger {
  @ApiProperty()
  roleType: string;
}
