import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import { join } from 'path';

export default function typeORMConfig(): TypeOrmModuleOptions {
    return  {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,

        logging: process.env.DB_LOGGING === 'true',
        dropSchema: false,
        synchronize: true,
        entities: [
            join(__dirname, '..', '**/*.entity.{ts,js}'),
        ],

        migrationsRun: process.env.DB_RUN_MIGRATIONS === 'true',
        migrationsTableName: 'migration',
        migrations: ['src/migration/*.ts'],
        cli: {
            migrationsDir: 'src/migration',
        },
        ssl: false
    }
}
