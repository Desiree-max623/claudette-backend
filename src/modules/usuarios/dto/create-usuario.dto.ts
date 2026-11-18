import { IsString, IsNotEmpty, IsEmail, MinLength, IsIn, IsOptional } from 'class-validator';
export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsIn(['admin', 'editor'])
  rol?: string;
}
