import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();
// <-- load .env variables
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000); // <-- start HTTP server
  console.log('Server running on http://localhost:3000');
}
bootstrap();
