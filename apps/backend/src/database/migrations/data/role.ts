import { RoleType } from "../../../common/enums/role-type";

export const roles = {
  [RoleType.SUPERADMIN]: 1,
  [RoleType.ORGADMIN]: 2,
  [RoleType.ADMIN]: 3,
  [RoleType.MEMBER]: 4,
};
