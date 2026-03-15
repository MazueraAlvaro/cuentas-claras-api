import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1773455232904 implements MigrationInterface {
  name = 'CreateUsersTable1773455232904';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE user (
        id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        UNIQUE INDEX IDX_user_email (email),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user`);
  }
}
