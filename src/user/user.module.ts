import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserProvider } from './user.provider';

@Module({
  imports: [],
  providers: [UsersService, ...UserProvider],
  exports: [UsersService],
})
export class UsersModule {}
