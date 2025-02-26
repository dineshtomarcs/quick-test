import { SetMetadata } from "@nestjs/common";
import { RoleType } from "../common/enums/role-type";

export const Roles = (...roles: RoleType[]) => SetMetadata("roles", roles);
