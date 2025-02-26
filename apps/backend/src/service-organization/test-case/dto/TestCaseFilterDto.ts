import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../../../service-users/user/dto/UserDto";

export class TestCaseFilterDto {
  @ApiProperty()
  readonly updatedBy: UserDto[];

  @ApiProperty()
  readonly createdBy: UserDto[];

  constructor(updatedBy: UserDto[], createdBy: UserDto[]) {
    this.updatedBy = updatedBy;
    this.createdBy = createdBy;
  }
}
