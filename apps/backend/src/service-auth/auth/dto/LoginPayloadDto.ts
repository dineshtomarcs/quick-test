import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../../../service-users/user/dto/UserDto";
import { TokenPayloadDto } from "./TokenPayloadDto";

export class LoginPayloadDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  @ApiProperty({ type: [String] })
  permissions: string[];

  constructor(user: UserDto, token: TokenPayloadDto, permissions: string[]) {
    this.user = user;
    this.token = token;
    this.permissions = permissions;
  }
}
