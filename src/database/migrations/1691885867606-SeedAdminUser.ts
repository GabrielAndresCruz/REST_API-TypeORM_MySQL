import { MigrationInterface, QueryRunner } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Roles } from "../../constants/Role";

export class SeedAdminUser1691885867606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repo = AppDataSource.getRepository(User);
    const userData = new User();
    userData.email = "admin@gmail.com";
    userData.name = "Admin";
    userData.role = Roles.ADMIN;
    userData.password = "admin123";

    const user = repo.create(userData);
    await repo.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user`);
  }
}
