import { Module } from '@nestjs/common';
import { ContactoService } from './contacto.service.js';
import { ContactoController } from './contacto.controller.js';

@Module({
  controllers: [ContactoController],
  providers: [ContactoService],
})
export class ContactoModule {}
