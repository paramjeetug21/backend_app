import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkspaceUserService } from './workspaceUser.service';
import {
  AddUserByEmailDto,
  AddUserToWorkspaceDto,
  UpdateNotificationDto,
  UpdateUserRoleDto,
} from './workspaceUser.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('workspace-users')
@UseGuards(JwtAuthGuard)
export class WorkspaceUserController {
  constructor(private readonly wsUserService: WorkspaceUserService) {}

  @Post(':workspaceId')
  addUser(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: AddUserToWorkspaceDto,
  ) {
    return this.wsUserService.addUser(
      workspaceId,
      dto.userId,
      dto.role || 'Viewer',
    );
  }

  // workspaceUser.controller.ts
  @Post('add-by-email/:workspaceId')
  async addUserByEmail(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: AddUserByEmailDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    const isAdmin = await this.wsUserService.isUserAdmin(workspaceId, userId);
    if (!isAdmin) {
      return {
        statusCode: 403,
        message: 'Only admins can add members to this workspace',
      };
    }
    await this.wsUserService.createNotification(
      req.user.id, // senderId
      workspaceId, // workspaceId
      dto.email, // receiver email
      dto.role || 'viewer', // role
    );
    return this.wsUserService.addUserByEmail(
      workspaceId,
      dto.email,
      dto.role || 'Viewer',
    );
  }
  @Get('notification')
  getUserNotifications(@Req() req) {
    const userId = req.user.id;
    return this.wsUserService.getUserNotifications(userId);
  }
  @Patch('notification/:id')
  update(@Param('id') id: string) {
    return this.wsUserService.update(id);
  }

  @Get(':workspaceId')
  getUsers(@Param('workspaceId') workspaceId: string) {
    return this.wsUserService.getUsers(workspaceId);
  }
  @Get()
  getAllWorkspace(@Req() req) {
    const userId = req.user.id;
    return this.wsUserService.getAllWorkspace(userId);
  }

  @Patch('role/:id')
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.wsUserService.updateRole(id, dto.role);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.wsUserService.removeUser(id);
  }
}
