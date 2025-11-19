import { Workspace } from './workspace.entity';

export const workspaceProvider = [
  {
    provide: 'WORKSPACE_REPOSITORY',
    useValue: Workspace,
  },
];
