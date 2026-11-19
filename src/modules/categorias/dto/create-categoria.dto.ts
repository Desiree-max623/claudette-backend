import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class CreateCategoriaDto {
  @IsString({ message: 'El slug debe ser texto' })
  @IsNotEmpty({ message: 'El slug es obligatorio' })
  @MaxLength(50, { message: 'El slug no puede superar los 50 caracteres' })
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'El slug solo admite minúsculas, números y guiones (ej: remeras-de-verano)',
  })
  slug: string;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  nombre: string;
}
