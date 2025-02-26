import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { PermissionType } from "../common/enums/permission";

@Entity("permissions")
@Index(["roleId"])
@Unique("permissionNameAndRoleId", ["permissionName", "roleId", "type"])
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permissionName: string;

  @Column({ type: "integer" })
  roleId: number;

  @Column({
    type: "enum",
    default: PermissionType.WEB,
    enum: PermissionType,
  })
  type: PermissionType;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
