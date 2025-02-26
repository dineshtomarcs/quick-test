import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import { Order } from "../enums/order";

export class PageOptionsDto {
  @ApiPropertyOptional({
    enum: Order,
    default: Order.ASC,
  })
  @IsEnum(Order, {
    message: "Order by is not valid, Valid values are ASC/DESC",
  })
  @IsOptional()
  readonly order: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Min(1, { message: "Page should be greater than 0" })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Min(1, { message: "Take should be greater than 0" })
  @Max(50, { message: "Take max size can be 50" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly q?: string;
}
