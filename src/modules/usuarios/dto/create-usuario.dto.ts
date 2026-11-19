import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsIn, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsOptional()
  @IsIn(['admin', 'cliente'])
  rol?: string;
}