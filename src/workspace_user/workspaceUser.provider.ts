import { WorkspaceUser } from './workspaceUser.entity';

export const workspaceUserProvider = [
  {
    provide: 'WorkspaceUser',
    useValue: WorkspaceUser,
  },
];
