import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from '../productos/productos.module.js';
import { ContactoModule } from '../contacto/contacto.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ProductosModule, ContactoModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}