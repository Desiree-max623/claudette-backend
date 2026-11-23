import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';

// Qué se devuelve junto con cada producto: su categoría y sus talles.
const incluir = { categoria: true, talles: true } as const;

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProductoDto) {
    const { talles = [], ...datos } = dto;
    return this.prisma.producto.create({
      data: { ...datos, talles: { connect: talles.map((id) => ({ id })) } },
      include: incluir,
    });
  }

  findAll() {
    return this.prisma.producto.findMany({ orderBy: { id: 'asc' }, include: incluir });
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id }, include: incluir });
    if (!producto) throw new NotFoundException(`No existe el producto con id ${id}`);
    return producto;
  }

  update(id: number, dto: UpdateProductoDto) {
    const { talles, ...datos } = dto;
    return this.prisma.producto.update({
      where: { id },
      // si mandan talles, el producto queda exactamente con esos talles
      data: { ...datos, ...(talles && { talles: { set: talles.map((id) => ({ id })) } }) },
      include: incluir,
    });
  }

  remove(id: number) {
    return this.prisma.producto.delete({ where: { id } });
  }
}
