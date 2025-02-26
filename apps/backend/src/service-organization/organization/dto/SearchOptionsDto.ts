import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, MinLength, IsString } from "class-validator";

import { Transform } from "class-transformer";

export class SearchOptionsDto {
  @Transform(({ value }) => value.trim())
  @MinLength(1, { message: "Query should be atleast of size 1" })
  @IsString({ message: "Query should be string" })
  @IsNotEmpty({ message: "Query cannot be empty" })
  @ApiProperty()
  query: string;
}
