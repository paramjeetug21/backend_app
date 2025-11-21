import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from '../documents/documents.eneity';
import { DocumentVersion } from './documentVersion.entity';

type InMemoryDoc = {
  content: any;
  clients: Set<string>;
  saveTimer?: NodeJS.Timeout | null;
  version: number;
};

@Injectable()
export class CollabService {
  private readonly logger = new Logger(CollabService.name);

  private docs = new Map<string, InMemoryDoc>();

  constructor(
    @InjectModel(Document) private readonly documentModel: typeof Document,
    @InjectModel(DocumentVersion)
    private readonly docVersionModel: typeof DocumentVersion,
  ) {}

  async ensureLoaded(documentId: string) {
    if (this.docs.has(documentId)) return this.docs.get(documentId)!;

    const doc = await this.documentModel.findByPk(documentId);
    const initial = doc ? (doc.content ?? {}) : {};

    const state: InMemoryDoc = {
      content: initial,
      clients: new Set<string>(),
      saveTimer: null,
      version: 1,
    };

    this.docs.set(documentId, state);
    this.logger.log(`Loaded document ${documentId} into memory`);
    return state;
  }

  async addClient(documentId: string, socketId: string) {
    const state = await this.ensureLoaded(documentId);
    state.clients.add(socketId);
    return { content: state.content, version: state.version };
  }

  removeClient(documentId: string, socketId: string) {
    const state = this.docs.get(documentId);
    if (!state) return;

    state.clients.delete(socketId);

    if (state.clients.size === 0) {
      if (state.saveTimer) clearTimeout(state.saveTimer);

      this.saveNow(documentId).catch((err) => this.logger.error(err));

      this.docs.delete(documentId);
      this.logger.log(`Unloaded document ${documentId}`);
    }
  }

  async applyChange(documentId: string, change: any, userId: string) {
    const state = await this.ensureLoaded(documentId);

    if (change.type === 'replace') {
      state.content = change.content;
      state.version++;
    } else if (change.type === 'delta') {
      if (!Array.isArray(state.content._deltas)) state.content._deltas = [];

      state.content._deltas.push({
        ops: change.ops,
        userId,
        t: Date.now(),
      });

      state.version++;
    } else if (change.type === 'cursor') {
      // cursors are not persisted
    } else {
      state.content = change;
      state.version++;
    }

    this.scheduleSave(documentId);
    return { content: state.content, version: state.version };
  }

  private scheduleSave(documentId: string, delay = 2000) {
    const state = this.docs.get(documentId)!;

    if (state.saveTimer) clearTimeout(state.saveTimer);

    state.saveTimer = setTimeout(() => {
      this.saveNow(documentId).catch((err) => this.logger.error(err));
    }, delay);
  }

  async saveNow(documentId: string) {
    const state = this.docs.get(documentId)!;
    const doc = await this.documentModel.findByPk(documentId);

    if (!doc) {
      this.logger.warn(`Document ${documentId} not found`);
      return;
    }

    doc.content = state.content;
    await doc.save();

    await this.docVersionModel.create({
      documentId,
      snapshot: state.content,
      message: `autosave v${state.version}`,
    });

    if (state.saveTimer) {
      clearTimeout(state.saveTimer);
      state.saveTimer = null;
    }

    this.logger.log(`Saved document ${documentId} (v${state.version})`);
  }

  async saveAll() {
    for (const [docId] of this.docs) {
      await this.saveNow(docId);
    }
  }
}
