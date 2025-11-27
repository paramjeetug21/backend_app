import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      // optional
      'http://localhost:5173',
      'https://frontend-egequ0dvr-paramjeetug21s-projects.vercel.app', // your deployed frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}

bootstrap();
