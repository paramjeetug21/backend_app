import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(@Body() CreateWorkspaceDto: CreateWorkspaceDto, @Req() req) {
    const userId = req.user.id; // extract from JWT middleware

    return this.workspaceService.create(CreateWorkspaceDto, req.user.id);
  }

  @Get()
  getUserWorkspaces(@Req() req) {
    const userId = req.user.id;
    return this.workspaceService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto) {
    return this.workspaceService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.workspaceService.remove(id);
  }
}
