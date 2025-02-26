import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../../../service-users/user/dto/UserDto";

export class MyProfilePayloadDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: [String] })
  permissions: string[];

  constructor(user: UserDto, permissions: string[]) {
    this.user = user;
    this.permissions = permissions;
  }
}
