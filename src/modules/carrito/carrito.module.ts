import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service.js';
import { CarritoController } from './carrito.controller.js';

@Module({
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}
