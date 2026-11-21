import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';

// Un producto dentro del carrito (tabla "carrito_items").
export class ItemCarritoDto {
  @IsInt({ message: 'productoId debe ser un número entero' })
  productoId: number;

  @IsInt({ message: 'talleId debe ser un número entero' })
  talleId: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  cantidad: number;
}

// Datos para CREAR un carrito (tabla "carritos").
export class CreateCarritoDto {
  @IsInt({ message: 'usuarioId debe ser un número entero' })
  usuarioId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // valida cada item con ItemCarritoDto
  @Type(() => ItemCarritoDto)
  items?: ItemCarritoDto[];
}
