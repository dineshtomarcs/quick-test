import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { UtilsService } from "../_helpers/utils.service";
import { AbstractDto } from "./dto/AbstractDto";
import { Exclude } from "class-transformer";

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  @Exclude()
  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

  toDto(options?: any) {
    return UtilsService.toDto(this.dtoClass, this, options);
  }
}
