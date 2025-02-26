import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EditSectionDto {
  @MaxLength(200, { message: "Name max size can be 200" })
  @IsString({ message: "Name should be a string" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  name: string;

  @MaxLength(500, { message: "Description max size can be 500" })
  @IsString({ message: "Description should be a string" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  description: string;
}
class testCaseId {
  @ApiProperty()
  testCaseId: string;
}
class newPosition {
  @ApiProperty()
  newPosition: number;
}
export class reOrderTestCasesSwagger {
  @ApiProperty()
  testCaseId: testCaseId;

  @ApiProperty()
  newPosition: newPosition;
}
