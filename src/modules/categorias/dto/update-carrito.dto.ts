import { PartialType } from '@nestjs/mapped-types';
import { CreateCarritoDto } from './create-carrito.dto.js';

export class UpdateCarritoDto extends PartialType(CreateCarritoDto) {}