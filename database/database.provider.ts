import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/user/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'aws-1-ap-southeast-1.pooler.supabase.com',
        port: 5432,
        username: 'postgres.lyoebknxanxqshedtwpr',
        password: 'Abcd@1234',
        database: 'postgres',
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
