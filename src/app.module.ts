import { Module } from '@nestjs/common';
import { DatabaseModule } from 'database/database.module';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
