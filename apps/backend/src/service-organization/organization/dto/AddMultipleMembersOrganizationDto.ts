import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";
import { AddOrganizationMemberDto } from "./AddOrganizationMemberDto";

export class AddMultipleMembersOrganizationDto {
  @ValidateNested({ each: true })
  @Type(() => AddOrganizationMemberDto)
  @ArrayNotEmpty({ message: "Members array cannot be empty" })
  @IsArray({ message: "Members must be an array of objects" })
  @IsNotEmpty({ message: "Members cannot be empty" })
  @ApiProperty({ type: [AddOrganizationMemberDto] })
  members: AddOrganizationMemberDto[];
}
