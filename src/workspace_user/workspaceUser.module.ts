import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkspaceUser } from './workspaceUser.entity';
import { Workspace } from 'src/workspace/workspace.entity';
import { User } from 'src/user/user.entity';
import { WorkspaceUserController } from './workspaceUser.controller';
import { WorkspaceUserService } from './workspaceUser.service';
import { workspaceUserProvider } from './workspaceUser.provider';
import { UsersModule } from 'src/user/user.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { notificationProvider } from './notification.provider';

@Module({
  imports: [UsersModule, forwardRef(() => WorkspaceModule)],
  controllers: [WorkspaceUserController],
  providers: [
    WorkspaceUserService,
    ...workspaceUserProvider,
    ...notificationProvider,
  ],
  exports: [
    WorkspaceUserService,
    ...workspaceUserProvider,
    ...notificationProvider,
  ],
})
export class WorkspaceUserModule {}
