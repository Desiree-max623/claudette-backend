import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateCarritoDto } from './create-carrito.dto.js';

export const ESTADOS_CARRITO = ['activo', 'confirmado', 'cancelado'] as const;

// Para EDITAR un carrito: reemplazar los items y/o cambiar el estado
// (por ejemplo, confirmar la compra). La dueña del carrito no se cambia.
export class UpdateCarritoDto extends PartialType(OmitType(CreateCarritoDto, ['usuarioId'] as const)) {
  @IsOptional()
  @IsIn(ESTADOS_CARRITO, { message: 'El estado debe ser activo, confirmado o cancelado' })
  estado?: (typeof ESTADOS_CARRITO)[number];
}
