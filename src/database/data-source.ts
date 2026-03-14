import { join } from 'path';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'cuentas_claras',
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  entities: [join(__dirname, 'entities', '*.entity.ts')],
});
