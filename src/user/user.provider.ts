import { User } from './user.entity';

export const UserProvider = [
  {
    provide: 'USER',
    useValue: User,
  },
];
