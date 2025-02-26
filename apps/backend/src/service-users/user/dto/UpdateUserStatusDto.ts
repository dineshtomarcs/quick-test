import { IsNotEmpty } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserStatusDto {
  @IsNotEmpty({ message: "Status empty or invalid" })
  @ApiPropertyOptional({
    type: Boolean,
  })
  status: boolean;
}
