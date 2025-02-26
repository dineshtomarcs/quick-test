import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { Plugins } from "../../../common/enums/plugins";

export class AddPluginConfigDto {
  @IsString({ message: "Access Token should be a string" })
  @IsNotEmpty({ message: "Access Token cannot be empty" })
  @ApiProperty({ type: String })
  accessToken: string;

  @IsString({ message: "Web address should be a string" })
  @IsNotEmpty({ message: "Web address cannot be empty" })
  @ApiProperty({ type: String })
  webAddress: string;

  @IsString({ message: "Username should be a string" })
  @IsNotEmpty({ message: "Username cannot be empty" })
  @ApiProperty({ type: String })
  userName: string;

  @IsString({ message: "Plugin should be a string" })
  @IsNotEmpty({ message: "Plugin cannot be empty" })
  @ApiProperty()
  plugin: () => Plugins;
}
