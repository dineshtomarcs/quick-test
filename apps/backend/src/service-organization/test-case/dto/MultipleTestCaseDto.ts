import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsArray, ArrayNotEmpty } from "class-validator";

export class MultipleTestCaseDto {
  @Type(() => String)
  @ArrayNotEmpty({ message: "testCaseIds array cannot be empty" })
  @IsArray({ message: "testCaseIds must be an array" })
  @IsNotEmpty({ message: "testCaseIds cannot be empty" })
  @ApiProperty()
  testCaseIds: string[];
}
