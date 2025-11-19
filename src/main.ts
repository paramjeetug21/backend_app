import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://frontend-app-henna-gamma.vercel.app', // your deployed frontend
      // for local development
    ],
    credentials: true,
  });

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}
bootstrap();
