import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCarritoDto, ItemCarritoDto } from './dto/create-carrito.dto.js';
import { UpdateCarritoDto } from './dto/update-carrito.dto.js';

// Qué se devuelve con cada carrito: la clienta y sus productos con nombre y talle.
const incluir = {
  usuario: { select: { id: true, nombre: true, email: true } },
  items: {
    orderBy: { id: 'asc' },
    include: { producto: { select: { nombre: true } }, talle: { select: { nombre: true } } },
  },
} as const;

@Injectable()
export class CarritoService {
  constructor(private readonly prisma: PrismaService) {}

  // Valida cada item (que el producto exista y tenga ese talle)
  // y le agrega el precio actual del producto.
  private async armarItems(items: ItemCarritoDto[]) {
    const ids = [...new Set(items.map((i) => i.productoId))];
    const productos = await this.prisma.producto.findMany({
      where: { id: { in: ids } },
      select: { id: true, precio: true, talles: { select: { id: true } } },
    });
    const porId = new Map(productos.map((p) => [p.id, p]));
    return items.map((item) => {
      const producto = porId.get(item.productoId);
      if (!producto) throw new BadRequestException(`No existe el producto con id ${item.productoId}`);
      if (!producto.talles.some((t) => t.id === item.talleId)) {
        throw new BadRequestException(`El producto ${item.productoId} no viene en el talle ${item.talleId}`);
      }
      return { ...item, precioUnitario: producto.precio };
    });
  }

  // Agrega el total del carrito a la respuesta.
  private conTotal<T extends { items: { cantidad: number; precioUnitario: number }[] }>(carrito: T) {
    return { ...carrito, total: carrito.items.reduce((suma, i) => suma + i.cantidad * i.precioUnitario, 0) };
  }

  async create(dto: CreateCarritoDto) {
    // Cada clienta tiene un solo carrito activo a la vez.
    const activo = await this.prisma.carrito.findFirst({ where: { usuarioId: dto.usuarioId, estado: 'activo' } });
    if (activo) throw new ConflictException(`La usuaria ya tiene un carrito activo (id ${activo.id})`);

    const items = await this.armarItems(dto.items ?? []);
    const carrito = await this.prisma.carrito.create({
      data: { usuarioId: dto.usuarioId, items: { create: items } },
      include: incluir,
    });
    return this.conTotal(carrito);
  }

  async findAll() {
    const carritos = await this.prisma.carrito.findMany({ orderBy: { id: 'asc' }, include: incluir });
    return carritos.map((c) => this.conTotal(c));
  }

  async findOne(id: number) {
    const carrito = await this.prisma.carrito.findUnique({ where: { id }, include: incluir });
    if (!carrito) throw new NotFoundException(`No existe el carrito con id ${id}`);
    return this.conTotal(carrito);
  }

  // Cambia el estado (ej: confirmar la compra) y/o reemplaza los productos del carrito.
  async update(id: number, dto: UpdateCarritoDto) {
    const items = dto.items ? await this.armarItems(dto.items) : undefined;
    const carrito = await this.prisma.carrito.update({
      where: { id },
      data: {
        ...(dto.estado && { estado: dto.estado }),
        ...(items && { items: { deleteMany: {}, create: items } }),
      },
      include: incluir,
    });
    return this.conTotal(carrito);
  }

  remove(id: number) {
    return this.prisma.carrito.delete({ where: { id } });
  }
}
