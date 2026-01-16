import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('app.apiPrefix'));

  app.enableCors({
    origin: configService.get('cors.origin'),
    credentials: configService.get('cors.credentials'),
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

  const port = configService.get('app.port');
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/${configService.get('app.apiPrefix')}`);
}

bootstrap();
