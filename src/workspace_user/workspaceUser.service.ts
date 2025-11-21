import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { WorkspaceUser } from './workspaceUser.entity';

import { User } from '../user/user.entity';
import { Notification } from './notification.entity';
import { Workspace } from '../workspace/workspace.entity';

@Injectable()
export class WorkspaceUserService {
  constructor(
    @Inject('USER')
    private readonly userModel: typeof User,
    @Inject('WorkspaceUser')
    private workspaceUserModel: typeof WorkspaceUser,
    @Inject('Notification')
    private notificationModel: typeof Notification,
    @Inject('WORKSPACE_REPOSITORY')
    private workspaceModel: typeof Workspace,
  ) {}

  async getAllWorkspace(userId: string) {
    console.log(userId);
    return this.workspaceUserModel.findAll({
      where: { userId },
    });
  }

  // Add user to workspace
  async addUser(workspaceId: string, userId: string, role: string) {
    const exists = await this.workspaceUserModel.findOne({
      where: { workspaceId, userId },
    });

    if (exists) {
      throw new BadRequestException('User already in workspace');
    }

    return this.workspaceUserModel.create({
      workspaceId,
      userId,
      role,
    });
  }

  // Get all users of a workspace
  async getUsers(workspaceId: string) {
    return this.workspaceUserModel.findAll({
      where: { workspaceId },
      include: { all: true },
    });
  }

  // Change user role
  async updateRole(workspaceUserId: string, role: string) {
    const record = await this.workspaceUserModel.findByPk(workspaceUserId);
    if (!record) throw new NotFoundException('Workspace user not found');

    // Owner cannot be demoted
    if (record.role === 'Admin') {
      throw new BadRequestException('Owner role cannot be changed');
    }

    record.role = role;
    return record.save();
  }

  // Remove user from workspace
  async removeUser(workspaceUserId: string) {
    const record = await this.workspaceUserModel.findByPk(workspaceUserId);
    if (!record) throw new NotFoundException('Workspace user not found');

    if (record.role === 'Admin') {
      throw new BadRequestException('Owner cannot be removed');
    }

    await record.destroy();
    return { message: 'User removed from workspace' };
  }

  async addUserByEmail(workspaceId: string, email: string, role: string) {
    // 1. Find user by email
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // 2. Check if user is already in workspace
    const existing = await this.workspaceUserModel.findOne({
      where: { workspaceId, userId: user.id },
    });
    if (existing) {
      throw new NotFoundException('User already exists in this workspace');
    }

    // 3. Add user to workspace
    const wsUser = await this.workspaceUserModel.create({
      workspaceId,
      userId: user.id,
      role,
    });
    console.log(wsUser);
    return wsUser;
  }

  async isUserAdmin(workspaceId: string, userId: string) {
    const wsUser = await this.workspaceUserModel.findOne({
      where: { workspaceId, userId },
    });

    return wsUser?.role === 'ADMIN';
  }

  async createNotification(
    senderId: string,
    workspaceId: string,
    email: string,
    role: string,
  ) {
    // 1. Find receiver user
    const user = await this.userModel.findOne({ where: { email } });
    const sender = await this.userModel.findByPk(senderId);
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    // 2. Find workspace
    const workspace = await this.workspaceModel.findByPk(workspaceId);

    // 3. Build message
    const message = `You are added by ${sender?.name} as ${role} in ${workspace?.name}`;

    // 4. Create notification (Sequelize: must pass object)
    const notify = await this.notificationModel.create({
      userId: user.id, // receiver
      message,
      isRead: false,
    });
    console.log(notify);
  }

  async getUserNotifications(userId: string) {
    return await this.notificationModel.findAll({
      where: { userId: userId },
      order: [['created_at', 'DESC']],
    });
  }

  async update(id: string) {
    const notif = await this.notificationModel.findByPk(id);

    if (!notif) {
      console.log('Notification not found');
      return { message: 'Notification not found' };
    }

    notif.isRead = true;
    await notif.save();

    return { message: 'Notification marked as read' };
  }
}
