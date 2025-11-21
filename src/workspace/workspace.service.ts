import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Workspace } from './workspace.entity';
import { WorkspaceUser } from '../workspace_user/workspaceUser.entity';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject('WORKSPACE_REPOSITORY')
    private workspaceModel: typeof Workspace,

    @Inject('WorkspaceUser')
    private workspaceUserModel: typeof WorkspaceUser,
  ) {}

  // Create workspace
  async create(createDto: CreateWorkspaceDto, userId: string) {
    const workspace = await this.workspaceModel.create({
      ...createDto,
      createdBy: userId,
    });

    // Add creator as OWNER in workspace_user table
    await this.workspaceUserModel.create({
      workspaceId: workspace.id,
      userId: userId,
      role: 'ADMIN',
    });

    return workspace;
  }

  // Get all workspaces user belongs to
  async findAllForUser(userId: string) {
    return this.workspaceModel.findAll({
      include: [
        {
          model: WorkspaceUser,
          where: { userId: userId },
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // Get single workspace
  async findOne(id: string) {
    const ws = await this.workspaceModel.findByPk(id, {
      include: { all: true },
    });
    if (!ws) throw new NotFoundException('Workspace not found');
    return ws;
  }

  // Update workspace
  async update(id: string, updateDto: UpdateWorkspaceDto) {
    const workspace = await this.findOne(id);
    return workspace.update(updateDto);
  }

  // Delete workspace
  async remove(id: string) {
    const workspace = await this.findOne(id);
    await workspace.destroy();
    return { message: 'Workspace deleted successfully' };
  }
}
