import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/user/user.entity';
import { config } from 'dotenv';
config();

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      });

      sequelize.addModels([User]);
      await sequelize.sync();

      return sequelize;
    },
  },
];
