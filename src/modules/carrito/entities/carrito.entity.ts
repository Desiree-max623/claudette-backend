export class ItemCarrito {
  id: number;
  productoId: number;
  talleId: number;
  cantidad: number;
  precioUnitario: number;   
}


export class Carrito {
  id: number;
  usuarioId: number;
  estado: 'activo' | 'confirmado' | 'cancelado';
  items: ItemCarrito[];
  createdAt: Date;
}
