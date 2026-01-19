const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const server = express();
let app;

async function bootstrap() {
  if (!app) {
    // Import the compiled AppModule from dist
    const { AppModule } = require('../dist/app.module');
    const { ConfigService } = require('@nestjs/config');

    app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    const configService = app.get(ConfigService);

    const apiPrefix = configService.get('app.apiPrefix') || 'api';
    app.setGlobalPrefix(apiPrefix);

    app.enableCors({
      origin: configService.get('cors.origin') || '*',
      credentials: configService.get('cors.credentials') !== false,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  await bootstrap();
  server(req, res);
};
