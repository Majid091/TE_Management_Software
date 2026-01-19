const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const server = express();
let app;
let bootstrapError = null;

async function bootstrap() {
  if (bootstrapError) {
    throw bootstrapError;
  }

  if (!app) {
    try {
      // Import the compiled AppModule (non-webpack build)
      const { AppModule } = require('../dist/src/app.module');
      const { ConfigService } = require('@nestjs/config');

      app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
        logger: ['error', 'warn', 'log'],
      });

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
      console.log('NestJS app initialized successfully');
    } catch (error) {
      console.error('Bootstrap error:', error);
      bootstrapError = error;
      throw error;
    }
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    await bootstrap();
    server(req, res);
  } catch (error) {
    console.error('Request handler error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};
