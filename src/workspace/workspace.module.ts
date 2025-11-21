import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { workspaceProvider } from './workspace.provider';
import { WorkspaceUserModule } from '../workspace_user/workspaceUser.module';

@Module({
  imports: [forwardRef(() => WorkspaceUserModule)],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, ...workspaceProvider],
  exports: [WorkspaceService, ...workspaceProvider],
})
export class WorkspaceModule {}
