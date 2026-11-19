import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Valida todos los datos que llegan con los DTO (class-validator).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // descarta campos que no están en el DTO
      forbidNonWhitelisted: true, // y responde error si mandan campos de más
      transform: true,            // convierte el body en una instancia del DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
