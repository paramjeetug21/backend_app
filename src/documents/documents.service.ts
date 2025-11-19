import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto, UpdateDocumentDto } from './documents.dto';
import { Document } from './documents.eneity';
import { DocumentVersing } from './documents-version.entity';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('Document_provider')
    private documentModel: typeof Document,

    @Inject('DocumentVersions') private versionModel: typeof DocumentVersing,
  ) {}

  // -------------------- EXISTING METHODS --------------------

  // Create a document
  async create(workspaceId: string, dto: CreateDocumentDto, userId: string) {
    return this.documentModel.create({
      ...dto,
      workspaceId,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  // Get all docs of workspace
  async findAll(workspaceId: string) {
    return this.documentModel.findAll({
      where: { workspaceId },
      include: { all: true },
      order: [['createdAt', 'DESC']],
    });
  }

  // Get single doc
  async findOne(id: string) {
    const doc = await this.documentModel.findByPk(id);
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  // Update document
  async update(id: string, dto: UpdateDocumentDto, userId: string) {
    const doc = await this.findOne(id);

    return doc.update({
      ...dto,
      updatedBy: userId,
    });
  }

  // Archive document
  async archive(id: string) {
    const doc = await this.findOne(id);

    doc.isArchived = true;
    await doc.save();

    return { message: 'Document archived successfully' };
  }

  // Delete document
  async remove(id: string) {
    const doc = await this.findOne(id);
    await doc.destroy();

    return { message: 'Document deleted successfully' };
  }

  // -------------------- NEW METHOD FOR WEBSOCKET --------------------

  /**
   * Save Yjs document content (real-time updates) to DB
   * @param id Document ID
   * @param content Yjs update array stored as number[]
   */
  async updateContent(id: string, content: number[], userId?: string | null) {
    const doc = await this.findOne(id);

    await doc.update({
      content,
      updatedBy: userId ?? null, // use null if userId undefined
    });

    return doc;
  }

  async saveDocumentWithVersion(
    documentId: string,
    content: any,
    userId: string,
  ) {
    const updated = await this.documentModel.update(
      { content, updatedBy: userId },
      { where: { id: documentId } },
    );

    if (!updated) throw new NotFoundException('Document not found');

    await this.versionModel.create({
      documentId,
      content,
      createdBy: userId,
    });

    return { message: 'Document saved and version created', content };
  }

  // ➤ Get all versions
  async getVersions(documentId: string) {
    return this.versionModel.findAll({
      where: { documentId },
      order: [['createdAt', 'DESC']],
    });
  }

  // ➤ Rollback to a version
  async rollbackToVersion(
    documentId: string,
    versionId: string,
    userId: string,
  ) {
    const version = await this.versionModel.findByPk(versionId);
    if (!version) throw new NotFoundException('Version not found');

    // Update main document with this version content
    await this.documentModel.update(
      { content: version.content, updatedBy: userId },
      { where: { id: documentId } },
    );

    // Save rollback as a new version
    await this.versionModel.create({
      documentId,
      content: version.content,
      createdBy: userId,
    });

    return { message: 'Rollback successful', content: version.content };
  }
}
