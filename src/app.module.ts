import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { DocumentModule } from './documents/documents.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    WorkspaceModule,
    DocumentModule,
    FileModule,
  ],
})
export class AppModule {}
