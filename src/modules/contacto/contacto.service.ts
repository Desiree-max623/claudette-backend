import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateContactoDto } from './dto/create-contacto.dto.js';
import { UpdateContactoDto } from './dto/update-contacto.dto.js';

// Junto con cada mensaje se devuelven los datos de la clienta que lo envió
// (si tiene cuenta). Se eligen los campos a mano para no mostrar la contraseña.
const incluirUsuario = {
  usuario: { select: { id: true, nombre: true, email: true } },
};

@Injectable()
export class ContactoService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContactoDto) {
    return this.prisma.contacto.create({ data: dto, include: incluirUsuario });
  }

  // Los mensajes más nuevos primero.
  findAll() {
    return this.prisma.contacto.findMany({
      orderBy: { createdAt: 'desc' },
      include: incluirUsuario,
    });
  }

  async findOne(id: number) {
    const contacto = await this.prisma.contacto.findUnique({
      where: { id },
      include: incluirUsuario,
    });

    if (!contacto) {
      throw new NotFoundException(`No existe el mensaje con id ${id}`);
    }

    return contacto;
  }

  async update(id: number, dto: UpdateContactoDto) {
    await this.findOne(id); // si no existe, corta acá con un 404

    return this.prisma.contacto.update({
      where: { id },
      data: dto,
      include: incluirUsuario,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // si no existe, corta acá con un 404

    return this.prisma.contacto.delete({ where: { id } });
  }
}
