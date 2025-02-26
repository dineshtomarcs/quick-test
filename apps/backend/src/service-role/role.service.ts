import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "./role.entity";
import { RoleType } from "../common/enums/role-type";
import { UserEntity } from "../service-users/user/user.entity";
import { RoleId } from "../common/enums/role-id";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  /* Creating a role */

  async createRole(roleType): Promise<boolean> {
    if (!Object.values(RoleType)?.includes(roleType)) {
      throw new HttpException(HttpStatus, HttpStatus.EXPECTATION_FAILED);
    }
    const exists = await this.roleRepository.findOneBy({ roleType });

    if (exists) {
      throw new HttpException(HttpStatus, HttpStatus.EXPECTATION_FAILED);
    }

    const creatingRole: RoleEntity = this.roleRepository.create();
    creatingRole.roleType = roleType;
    await this.roleRepository.save(creatingRole);

    return true;
  }

  /* Get a role by ID */

  async findRoleById(id: number): Promise<RoleEntity> {
    return this.roleRepository.findOneBy({ id });
  }

  /* Find roleType */

  async findByRoleType(roleType: RoleType): Promise<RoleEntity> {
    return this.roleRepository
      .createQueryBuilder("roles")
      .where("roles.roleType = :roleType", { roleType })
      .getOneOrFail();
  }

  /* Internal method for user that finds the role he can add */

  async findRolesToAdd(currentLoggedInUser: UserEntity): Promise<any> {
    let roleTypes;
    if (currentLoggedInUser.roleId === RoleId.ORGADMIN) {
      roleTypes = [RoleType.ADMIN, RoleType.MEMBER];
    } else if (currentLoggedInUser.roleId === RoleId.SUPERADMIN) {
      roleTypes = [RoleType.ORGADMIN, RoleType.ADMIN, RoleType.MEMBER];
    } else if (currentLoggedInUser.roleId === RoleId.ADMIN) {
      roleTypes = [RoleType.MEMBER];
    }

    return this.roleRepository
      .createQueryBuilder("roles")
      .where("roles.role_type IN (:...roleTypes)", { roleTypes })
      .getMany();
  }
}
