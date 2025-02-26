import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class UpdatePluginConfigDto {
  @IsString({ message: "Access Token should be a string" })
  @IsNotEmpty({ message: "Access Token cannot be empty" })
  @IsOptional()
  @ApiProperty({ type: String })
  accessToken: string;

  @IsString({ message: "Web address should be a string" })
  @IsNotEmpty({ message: "Web address cannot be empty" })
  @IsOptional()
  @ApiProperty({ type: String })
  webAddress: string;

  @IsString({ message: "Username should be a string" })
  @IsNotEmpty({ message: "Username cannot be empty" })
  @IsOptional()
  @ApiProperty({ type: String })
  userName: string;
}
