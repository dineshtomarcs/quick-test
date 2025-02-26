import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../../service-users/user/user.module";
import { EmailModule } from "../../service-emails/email/email.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PermissionModule } from "../../service-permission/permission.module";
import { PaymentModule } from "../../service-organization/payment/payment.module";
import { UserEntity } from "../../service-users/user/user.entity";

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => EmailModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => PaymentModule),
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule.register({ defaultStrategy: "jwt" }), AuthService],
})
export class AuthModule {}
