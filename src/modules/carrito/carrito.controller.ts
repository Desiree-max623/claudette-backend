import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CarritoService } from './carrito.service.js';
import { CreateCarritoDto } from './dto/create-carrito.dto.js';
import { UpdateCarritoDto } from './dto/update-carrito.dto.js';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  create(@Body() createCarritoDto: CreateCarritoDto) {
    return this.carritoService.create(createCarritoDto);
  }

  @Get()
  findAll() {
    return this.carritoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCarritoDto: UpdateCarritoDto) {
    return this.carritoService.update(id, updateCarritoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.remove(id);
  }
}
