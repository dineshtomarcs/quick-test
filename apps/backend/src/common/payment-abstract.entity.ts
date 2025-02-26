import { CreateDateColumn, UpdateDateColumn } from "typeorm";

import { UtilsService } from "../_helpers/utils.service";
import { AbstractDto } from "./dto/AbstractDto";

export abstract class PaymentAbstractEntity<
  T extends AbstractDto = AbstractDto,
> {
  @CreateDateColumn({
    type: "timestamp without time zone",
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp without time zone",
    name: "updated_at",
  })
  updatedAt: Date;

  abstract dtoClass: new (entity: PaymentAbstractEntity, options?: any) => T;

  toDto(options?: any) {
    return UtilsService.toDto(this.dtoClass, this, options);
  }
}
