import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, MaxLength, IsString } from "class-validator";

export class EditProjectDto {
  @MaxLength(200, { message: "Name max size can be 200" })
  @IsString({ message: "Name should be a string" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  name: string;

  @MaxLength(500, { message: "Description max size can be 500" })
  @IsString({ message: "Description should be a string" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  readonly description: string;
}

export class editProjectSwagger {
  @ApiProperty()
  project: EditProjectDto;
}
