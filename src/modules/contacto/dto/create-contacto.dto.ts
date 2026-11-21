import { IsString, IsNotEmpty, IsEmail, MaxLength, IsIn, IsOptional, IsInt } from 'class-validator';

export class CreateContactoDto {
  // Si la consulta la envía una clienta registrada, queda relacionada con ella.
  @IsOptional()
  @IsInt({ message: 'usuarioId debe ser un número entero' })
  usuarioId?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @IsIn(['consulta', 'talles', 'envios', 'cambios'])
  motivo: string;

  @IsString()
  @IsNotEmpty()
  mensaje: string;
}
