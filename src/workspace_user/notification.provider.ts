import { Notification } from './notification.entity';

export const notificationProvider = [
  {
    provide: 'Notification',
    useValue: Notification,
  },
];
