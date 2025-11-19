// src/documents/documents.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as Y from 'yjs';
import { DocumentService } from './documents.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class DocumentsGateway {
  @WebSocketServer()
  server: Server;

  private docs = new Map<string, Y.Doc>();

  constructor(private docsService: DocumentService) {}

  @SubscribeMessage('join-document')
  async handleJoin(
    @MessageBody() data: { docId: string; user: any },
    @ConnectedSocket() socket: Socket,
  ) {
    const { docId } = data;
    socket.join(docId);

    let ydoc = this.docs.get(docId);
    if (!ydoc) {
      ydoc = new Y.Doc();
      const docFromDb = await this.docsService.findOne(docId);
      if (
        docFromDb?.content &&
        Array.isArray(docFromDb.content) &&
        docFromDb.content.length > 0
      ) {
        try {
          Y.applyUpdate(ydoc, Uint8Array.from(docFromDb.content as number[]));
        } catch (err) {
          console.error('Failed to apply Yjs update from DB:', err);
        }
      }

      this.docs.set(docId, ydoc);
    }

    socket.emit('load-document', Y.encodeStateAsUpdate(ydoc));
  }

  @SubscribeMessage('send-changes')
  async handleChanges(
    @MessageBody() data: { docId: string; update: Uint8Array },
    @ConnectedSocket() socket: Socket,
  ) {
    const ydoc = this.docs.get(data.docId);
    if (!ydoc) return;
    Y.applyUpdate(ydoc, data.update);
    socket.to(data.docId).emit('receive-changes', data.update);

    // Save periodically
    const updateArray = Array.from(Y.encodeStateAsUpdate(ydoc));
    await this.docsService.updateContent(
      data.docId,
      updateArray,
      socket.handshake.auth.userId ?? null,
    );
  }

  @SubscribeMessage('cursor-update')
  handleCursorUpdate(
    @MessageBody() data: { docId: string; states: any[] },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(data.docId).emit('cursor-update', data.states);
  }
}
