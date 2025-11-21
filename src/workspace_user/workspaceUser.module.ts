import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceUserController } from './workspaceUser.controller';
import { WorkspaceUserService } from './workspaceUser.service';
import { workspaceUserProvider } from './workspaceUser.provider';
import { UsersModule } from '../user/user.module';
import { WorkspaceModule } from '../workspace/workspace.module';
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
