import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("email_verify_tokens")
export class EmailVerifyTokenEntity {
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
