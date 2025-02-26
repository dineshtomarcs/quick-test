export const enum ProjectPermissions {
  CREATE_PROJECT = "create:project",
  EDIT_PROJECT = "edit:project",
  DELETE_PROJECT = "delete:project",
}

export const enum MilestonePermissions {
  CREATE_MILESTONE = "create:milestone",
  UPDATE_MILESTONE = "update:milestone",
  DELETE_MILESTONE = "delete:milestone",
  UPDATE_MILESTONE_STATUS = "update:milestone-status",
}
export const enum TestCasePermissions {
  CREATE_TESTCASE = "create:project-testcase",
  EDIT_TESTCASE = "edit:testcase",
  EDIT_MULTIPLE_TESTCASE = "edit:multiple-testcases",
}

export const enum JiraPluginPermissions {
  ADD_PLUGIN = "add:plugin",
  UPDATE_PLUGIN = "update:plugin",
}

export const enum UserManagementPermissions {
  RESET_PASSWORD_LINK = "reset-password-link",
  ADD_MEMBERS = "add:members",
  UPDATE_MEMBER = "update:member",
}

export enum ArchivePermissions {
  GET_ARCHIVED_USER = "get:archived-user",
  ARCHIVE_USER = "archive:user",
  REACTIVATE_USER = "reactivate:user",
  DELETE_USER = "delete:user",
  ARCHIVE_PROJECT = "archive:project",
  RESTORE_PROJECT = "restore:project",
  LIST_ARCHIVE_PROJECT = "list:archive-project",
}

export enum RoleId {
  SUPERADMIN = 1,
  OWNER = 2,
  ADMIN = 3,
  MEMBER = 4,
}

export enum RoleType {
  SUPERADMIN = "SUPERADMIN",
  OWNER = "ORGADMIN",
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

export enum RoleName {
  SUPERADMIN = "Super Admin",
  OWNER = "Owner",
  ADMIN = "Admin",
  MEMBER = "Member",
}

export enum PaymentPermissions {
  CREATE_CHECKOUT_SESSION = "create:checkout-session",
  CREATE_PORTAL_SESSION = "create:portal-session",
  GET_PRODUCT = "get:product",
  GET_PRICE = "get:price",
}

export type AccessPermission = ProjectPermissions | MilestonePermissions | TestCasePermissions | JiraPluginPermissions | UserManagementPermissions | ArchivePermissions
