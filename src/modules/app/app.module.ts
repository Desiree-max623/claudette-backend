import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from '../productos/productos.module.js';
import { CategoriasModule } from '../categorias/categorias.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { CarritoModule } from '../carrito/carrito.module.js';
import { ContactoModule } from '../contacto/contacto.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProductosModule,
    CategoriasModule,
    UsuariosModule,
    CarritoModule,
    ContactoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}