import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { DocumentModule } from './documents/documents.module';
import { FileModule } from './file/file.module';
import { DatabaseModule } from 'src/database/database.module';

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
