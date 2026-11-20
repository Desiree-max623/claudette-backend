import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateCarritoDto {
  @IsInt({ message: 'El producto debe ser un número entero' })
  @IsPositive({ message: 'El producto debe ser un id válido' })
  producto_id: number;

  @IsOptional()
  @IsInt({ message: 'El talle debe ser un número entero' })
  @IsPositive({ message: 'El talle debe ser un id válido' })
  talle_id?: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  cantidad: number;
}