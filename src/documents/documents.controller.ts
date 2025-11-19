import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  Req,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { DocumentService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './documents.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // ➤ Create document inside a workspace

  @Post(':workspaceId')
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateDocumentDto,
    @Req() req,
  ) {
    console.log('everything okay till now', workspaceId, dto);
    const userId = req.user.id;
    return this.documentService.create(workspaceId, dto, userId);
  }

  // ➤ Get all documents by workspace (Frontend matches this)
  @Get()
  findAll(@Query('workspaceId') workspaceId: string) {
    return this.documentService.findAll(workspaceId);
  }

  // ➤ Get single document
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  // ➤ Update document
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto, @Req() req) {
    const userId = req.user.id;
    return this.documentService.update(id, dto, userId);
  }

  // ➤ Archive a document
  @Patch('archive/:id')
  archive(@Param('id') id: string) {
    return this.documentService.archive(id);
  }

  // ➤ Delete document
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.documentService.remove(id);
  }

  // ➤ Save new version
 @Post(':id/version')
createVersion(
  @Param('id') documentId: string,
  @Body('content') content: string,
  @Req() req: any, // or a proper type like Request & { user: { id: string } }
) {
  const userId = req.user.id; 
  return this.documentService.saveDocumentWithVersion(documentId, content, userId);
}


  // ➤ Get all versions for a document
  @Get(':id/versions')
  async getVersions(@Param('id') documentId: string) {
    return this.documentService.getVersions(documentId);
  }

  // ➤ Rollback: restore a specific version as current content
  @Post(':id/rollback/:versionId')
  async rollback(
    @Param('id') documentId: string,
    @Param('versionId') versionId: string,
    @Req() req,
  ) {
    const userId = req.user.id;
    if (!versionId) throw new BadRequestException('versionId is required');
    if (!documentId) throw new BadRequestException('documentId is required');

    return this.documentService.rollbackToVersion(
      documentId,
      versionId,
      userId,
    );
  }
}
