import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Document } from 'src/documents/documents.eneity';
import { DocumentVersion } from './documentVersion.entity';

import { CollabService } from './collab.service';
import { CollabGateway } from './collab.gateway';

@Module({
  imports: [],
  providers: [CollabService, CollabGateway],
  exports: [CollabService],
})
export class CollabModule {}
