import { Module } from '@nestjs/common';
import { CollabService } from './collab.service';
import { CollabGateway } from './collab.gateway';

@Module({
  imports: [],
  providers: [CollabService, CollabGateway],
  exports: [CollabService],
})
export class CollabModule {}
