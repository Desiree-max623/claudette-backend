// Entidad = cómo es un producto. Coincide con la tabla "productos".
export class Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  descripcion: string | null;
  stock: number;
  destacado: boolean;
  activo: boolean;         // false = pausado (no se muestra en el catálogo)
  categoriaId: number;     // relación: cada producto pertenece a una categoría
}
