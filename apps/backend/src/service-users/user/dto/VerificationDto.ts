import { IsEmail, IsUUID, Length, IsDate } from "class-validator";

export class VerificationDto {
  @IsEmail()
  email: string;

  @IsUUID()
  @Length(0, 200)
  token: string;

  @IsDate()
  timestamp: Date;

  constructor(verification: any) {
    this.email = verification.email;
    this.token = verification.token;
    this.timestamp = verification.timestamp;
  }
}
