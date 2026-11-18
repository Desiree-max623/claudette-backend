import { Injectable } from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto.js';
import { UpdateCarritoDto } from './dto/update-carrito.dto.js';

@Injectable()
export class CarritoService {
  create(createCarritoDto: CreateCarritoDto) {
    return 'This action adds a new carrito';
  }

  findAll() {
    return `This action returns all carrito`;
  }

  findOne(id: number) {
    return `This action returns a #${id} carrito`;
  }

  update(id: number, updateCarritoDto: UpdateCarritoDto) {
    return `This action updates a #${id} carrito`;
  }

  remove(id: number) {
    return `This action removes a #${id} carrito`;
  }
}
