import { Module } from '@nestjs/common';

import { DocumentService } from './documents.service';
import { DocumentController } from './documents.controller';
import { documentProvider } from './documents.provider';
import { DocumentsGateway } from './documents.gateway';
import { DocumentVersionsProvider } from './documents-version.provider';

@Module({
  imports: [],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    ...documentProvider,
    ...DocumentVersionsProvider,
    DocumentsGateway,
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
