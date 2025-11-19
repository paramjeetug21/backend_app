import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CollabGateway {
  @WebSocketServer()
  server: Server;

  // Called when user connects
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  // Called when user disconnects
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // JOIN DOCUMENT ROOM
  @SubscribeMessage('join_document')
  handleJoin(
    @MessageBody() data: { documentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.documentId);
    console.log(`User ${client.id} joined doc ${data.documentId}`);
  }

  // RECEIVE + BROADCAST DOCUMENT UPDATES
  @SubscribeMessage('document_update')
  handleDocUpdate(
    @MessageBody() data: { documentId: string; content: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.to(data.documentId).emit('document_update', data);
  }

  // BROADCAST CURSOR POSITION
  @SubscribeMessage('cursor_update')
  handleCursor(
    @MessageBody()
    data: { documentId: string; userId: string; cursor: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.to(data.documentId).emit('cursor_update', data);
  }
}
