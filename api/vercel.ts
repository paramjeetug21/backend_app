import { NestFactory } from '@nestjs/core';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const { AppModule } = require('../dist/src/app.module.js');
    const app = await NestFactory.create(AppModule);

    // ✅ CORS settings for frontend
    app.enableCors({
      origin: [
        'https://frontend-app-henna-gamma.vercel.app', // deployed frontend
        'http://localhost:5173', // local frontend
      ],
      credentials: true, // needed if sending cookies/auth headers
    });

    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await bootstrapServer();
  return server(req, res);
}
