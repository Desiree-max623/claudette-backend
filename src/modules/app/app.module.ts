import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from '../productos/productos.module.js';
import { ContactoModule } from '../contacto/contacto.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ProductosModule, ContactoModule, UsuariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}