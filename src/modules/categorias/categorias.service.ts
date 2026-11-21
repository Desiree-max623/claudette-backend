import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCategoriaDto) {
    return this.prisma.categoria.create({ data: dto });
  }

  findAll() {
    return this.prisma.categoria.findMany({
      orderBy: { id: 'asc' },
      include: { _count: { select: { productos: true } } }, // cuántos productos tiene cada una
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: { productos: { where: { activo: true } } },
    });
    if (!categoria) throw new NotFoundException(`No existe la categoría con id ${id}`);
    return categoria;
  }

  update(id: number, dto: UpdateCategoriaDto) {
    return this.prisma.categoria.update({ where: { id }, data: dto });
  }

  // Si la categoría tiene productos, la base no deja borrarla (responde 400).
  remove(id: number) {
    return this.prisma.categoria.delete({ where: { id } });
  }
}
