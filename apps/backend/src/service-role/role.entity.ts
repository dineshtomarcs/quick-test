import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { UserEntity } from "../service-users/user/user.entity";
import { RoleType } from "../common/enums/role-type";

@Entity("roles")
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: RoleType,
  })
  roleType: RoleType;

  @OneToMany(() => UserEntity, (users) => users.role, {
    nullable: true,
  })
  users: UserEntity[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
