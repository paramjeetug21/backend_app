import { DocumentVersing } from './documents-version.entity';

export const DocumentVersionsProvider = [
  {
    provide: 'DocumentVersions',
    useValue: DocumentVersing,
  },
];
