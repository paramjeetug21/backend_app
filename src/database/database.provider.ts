import { Sequelize } from 'sequelize-typescript';
import { Workspace } from '../workspace/workspace.entity';
import { WorkspaceUser } from '../workspace_user/workspaceUser.entity';
import { Document } from '../documents/documents.eneity';
import { DocumentVersing } from '../documents/documents-version.entity';
import { Notification } from '../workspace_user/notification.entity';
import { User } from '../user/user.entity';

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
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

sequelize.addModels([
  User,
  Workspace,
  WorkspaceUser,
  Document,
  DocumentVersing,
  Notification,
]);

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      await sequelize.sync();
      return sequelize;
    },
  },
];
