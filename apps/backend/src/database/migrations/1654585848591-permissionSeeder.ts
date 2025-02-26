import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { PermissionType } from "../../common/enums/permission";

import {
  SUPERADMIN_BACKEND_PERMISSIONS,
  ORGADMIN_BACKEND_PERMISSIONS,
  ADMIN_BACKEND_PERMISSIONS,
  MEMBER_BACKEND_PERMISSIONS,
  SUPERADMIN_PERMISSIONS,
  ORGADMIN_PERMISSIONS,
  ADMIN_PERMISSIONS,
  MEMBER_PERMISSIONS,
} from "./data/permission";
import { RoleId } from "../../common/enums/role-id";

export class permissionSeeder1654585848591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissionsRepository = await getRepository("permissions");
    // inserting superadmin backend permissions in the db
    // to avoid any accidental repetions in the permissions table
    let unique = [...new Set(SUPERADMIN_BACKEND_PERMISSIONS)];
    for (let i = 0; i < unique.length; i++) {
      const permission = permissionsRepository.create();
      Object.assign(permission, {
        type: PermissionType.BACKEND,
        permissionName: unique[i],
        roleId: RoleId.SUPERADMIN,
      });
      await queryRunner.manager.save(permission);
    }

    // inserting orgadmin backend permissions in the db

    unique = [...new Set(ORGADMIN_BACKEND_PERMISSIONS)];
    for (let i = 0; i < unique.length; i++) {
      const permission = permissionsRepository.create();
      Object.assign(permission, {
        type: PermissionType.BACKEND,
        permissionName: unique[i],
        roleId: RoleId.ORGADMIN,
      });
      await queryRunner.manager.save(permission);
    }

    // inserting admin backend permissions in the db

    unique = [...new Set(ADMIN_BACKEND_PERMISSIONS)];
    for (let i = 0; i < unique.length; i++) {
      const permission = permissionsRepository.create();
      Object.assign(permission, {
        type: PermissionType.BACKEND,
        permissionName: unique[i],
        roleId: RoleId.ADMIN,
      });
      await queryRunner.manager.save(permission);
    }

    // inserting member backend permissions in the db

    unique = [...new Set(MEMBER_BACKEND_PERMISSIONS)];
    for (let i = 0; i < unique.length; i++) {
      const permission = permissionsRepository.create();
      Object.assign(permission, {
        type: PermissionType.BACKEND,
        permissionName: unique[i],
        roleId: RoleId.MEMBER,
      });
      await queryRunner.manager.save(permission);
    }

    // inserting SUPERADMIN PERMISSIONS IN DB
    let uniqueweb = [...new Set(SUPERADMIN_PERMISSIONS)];
    for (let i = 0; i < uniqueweb.length; i++) {
      const permission = permissionsRepository.create();
      Object.assign(permission, {
        type: PermissionType.WEB,
        permissionName: uniqueweb[i],
        roleId: RoleId.SUPERADMIN,
      });
      await queryRunner.manager.save(permission);
    }

    // inserting ORGADMIN PERMISSIONS IN DB

    uniqueweb = [...new Set(ORGADMIN_PERMISSIONS)];
    for (let i = 0; i < uniqueweb.length; i++) {
      const permission = permissionsRepository.create();
      Object.assign(permission, {
        type: PermissionType.WEB,
        permissionName: uniqueweb[i],
        roleId: RoleId.ORGADMIN,
      });
      await queryRunner.manager.save(permission);
    }

    // inserting ADMIN PERMISSIONS IN DB

    uniqueweb = [...new Set(ADMIN_PERMISSIONS)];
    for (let i = 0; i < uniqueweb.length; i++) {
      const permission = permissionsRepository.create();
      Object.assign(permission, {
        type: PermissionType.WEB,
        permissionName: uniqueweb[i],
        roleId: RoleId.ADMIN,
      });
      await queryRunner.manager.save(permission);
    }

    // inserting MEMBER PERMISSIONS IN DB

    uniqueweb = [...new Set(MEMBER_PERMISSIONS)];
    for (let i = 0; i < uniqueweb.length; i++) {
      const permission = permissionsRepository.create();
      Object.assign(permission, {
        type: PermissionType.WEB,
        permissionName: uniqueweb[i],
        roleId: RoleId.MEMBER,
      });
      await queryRunner.manager.save(permission);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("delete from permissions");
  }
}
