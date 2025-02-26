import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("forgotten_password_requests")
export class ForgottenPasswordEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true, length: 150 })
  email: string;

  @Column({ type: "varchar", nullable: true, length: 200 })
  token: string;

  @Column("timestamp", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  timestamp: Date;
}
