import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateDefectRefDto {
  @IsString({ message: "Plugin key should be a string" })
  @IsNotEmpty({ message: "Plugin key cannot be empty" })
  @ApiProperty({ type: String })
  pluginKey: string;
}
