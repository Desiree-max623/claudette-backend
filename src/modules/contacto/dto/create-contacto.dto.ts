import { IsString, IsNotEmpty, IsEmail, MaxLength, IsIn, IsOptional } from 'class-validator';

export class CreateContactoDto {
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
