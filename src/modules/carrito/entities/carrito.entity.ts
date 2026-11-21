// Un producto dentro del carrito. Coincide con la tabla "carrito_items".
export class ItemCarrito {
  id: number;
  productoId: number;
  talleId: number;
  cantidad: number;
  precioUnitario: number;   // se guarda el precio del momento en que se agregó
}

// Cómo es un carrito. Coincide con la tabla "carritos".
// Relación: una clienta tiene carritos; un carrito tiene muchos items.
export class Carrito {
  id: number;
  usuarioId: number;
  estado: 'activo' | 'confirmado' | 'cancelado';
  items: ItemCarrito[];
  creadoEn: Date;
}
