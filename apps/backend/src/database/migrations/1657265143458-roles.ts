import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { roles } from "./data/role";

export class roles1657265143458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const rolesRepository = await getRepository("roles");
    for (const [key, value] of Object.entries(roles)) {
      const roles = rolesRepository.create();
      Object.assign(roles, {
        roleType: key,
        id: value,
      });
      await queryRunner.manager.save(roles);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("delete from roles");
  }
}
