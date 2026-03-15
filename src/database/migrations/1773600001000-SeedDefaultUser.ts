import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultUser1773600001000 implements MigrationInterface {
  name = 'SeedDefaultUser1773600001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Password: 123456
    const passwordHash =
      '$2b$10$ivCBCmmy.AoaUNkCvX7AI.8xafoVx7J1GaCLVhKjbJNV9SG3NWW4C';

    await queryRunner.query(
      `INSERT INTO \`user\` (email, password, name) VALUES (?, ?, ?)`,
      ['me@alvaromazuera.com', passwordHash, 'Alvaro Mazuera'],
    );

    const result = await queryRunner.query(
      `SELECT id FROM \`user\` WHERE email = ?`,
      ['me@alvaromazuera.com'],
    );
    const userId = result[0].id;

    await queryRunner.query(
      `UPDATE \`expense\` SET userId = ? WHERE userId IS NULL`,
      [userId],
    );
    await queryRunner.query(
      `UPDATE \`income\` SET userId = ? WHERE userId IS NULL`,
      [userId],
    );
    await queryRunner.query(
      `UPDATE \`month\` SET userId = ? WHERE userId IS NULL`,
      [userId],
    );
    await queryRunner.query(
      `UPDATE \`credit_card\` SET userId = ? WHERE userId IS NULL`,
      [userId],
    );
    await queryRunner.query(
      `UPDATE \`transaction\` SET userId = ? WHERE userId IS NULL`,
      [userId],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(
      `SELECT id FROM \`user\` WHERE email = ?`,
      ['me@alvaromazuera.com'],
    );
    if (!result.length) return;
    const userId = result[0].id;

    await queryRunner.query(
      `UPDATE \`expense\` SET userId = NULL WHERE userId = ?`,
      [userId],
    );
    await queryRunner.query(
      `UPDATE \`income\` SET userId = NULL WHERE userId = ?`,
      [userId],
    );
    await queryRunner.query(
      `UPDATE \`month\` SET userId = NULL WHERE userId = ?`,
      [userId],
    );
    await queryRunner.query(
      `UPDATE \`credit_card\` SET userId = NULL WHERE userId = ?`,
      [userId],
    );
    await queryRunner.query(
      `UPDATE \`transaction\` SET userId = NULL WHERE userId = ?`,
      [userId],
    );

    await queryRunner.query(`DELETE FROM \`user\` WHERE email = ?`, [
      'me@alvaromazuera.com',
    ]);
  }
}
