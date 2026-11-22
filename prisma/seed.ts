// Datos de ejemplo de Claudette. Se cargan con: npx prisma db seed
// Vacía las tablas y vuelve a crear todo (los ids empiezan siempre en 1).
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "ItemCarrito", "Carrito", "Contacto", "Producto", "Talle", "Categoria", "Usuario" RESTART IDENTITY CASCADE',
  );

  // ---------- Categorías ----------
  const cat: Record<string, number> = {};
  for (const [slug, nombre] of [
    ['remeras', 'Remeras'], ['vestidos', 'Vestidos'], ['pantalones', 'Pantalones'],
    ['abrigos', 'Abrigos'], ['calzados', 'Calzado'], ['accesorios', 'Accesorios'],
  ]) {
    cat[slug] = (await prisma.categoria.create({ data: { slug, nombre } })).id;
  }

  // ---------- Talles ----------
  const talle: Record<string, number> = {};
  for (const nombre of ['S', 'M', 'L', '36', '37', '38', '39', '40', 'Único']) {
    talle[nombre] = (await prisma.talle.create({ data: { nombre } })).id;
  }
  const ropa = ['S', 'M', 'L'];
  const calzado = ['36', '37', '38', '39', '40'];

  // ---------- Productos (los mismos del frontend) ----------
  const productos = [
    { nombre: 'Vestido Floral', precio: 45900, imagen: '/img/ui/claudete-vestido.jpg', descripcion: 'Vestido floral de temporada, ideal para ocasiones especiales.', stock: 8, destacado: true, categoria: 'vestidos', talles: ropa },
    { nombre: 'Blusa Elegance', precio: 32500, imagen: '/img/productos/Remera.jpeg', descripcion: 'Blusa elegante y cómoda para combinar con diferentes prendas.', stock: 12, destacado: true, categoria: 'remeras', talles: ropa },
    { nombre: 'Jean Classic', precio: 52900, imagen: '/img/productos/Pantalon.jpeg', descripcion: 'Jean clásico de corte moderno y cómodo.', stock: 10, destacado: true, categoria: 'pantalones', talles: ropa },
    { nombre: 'Campera Urbana', precio: 78900, imagen: '/img/ui/campera-jean-claudette.jpg', descripcion: 'Campera urbana para los días fríos.', stock: 5, destacado: true, categoria: 'abrigos', talles: ropa },
    { nombre: 'Top Básico', precio: 19900, imagen: '/img/productos/images.jpg', descripcion: 'Top básico y versátil para cualquier ocasión.', stock: 15, categoria: 'remeras', talles: ropa },
    { nombre: 'Abrigo Soft', precio: 89900, imagen: '/img/productos/abrigo.jpeg', descripcion: 'Abrigo cómodo y moderno para la temporada de invierno.', stock: 4, activo: false, categoria: 'abrigos', talles: ropa },
    { nombre: 'Remera básica', precio: 18500, imagen: '/img/productos/Remera.jpeg', descripcion: 'Remera de algodón suave, corte clásico. Combina con todo y es ideal para el uso diario.', stock: 20, categoria: 'remeras', talles: ropa },
    { nombre: 'Vestido floreado', precio: 45000, imagen: '/img/ui/claudete-vestido.jpg', descripcion: 'Vestido floreado de tela liviana, corte suelto y mangas cortas. Ideal para primavera y verano.', stock: 7, categoria: 'vestidos', talles: ropa },
    { nombre: 'Pantalón de lino', precio: 38000, imagen: '/img/productos/Pantalon.jpeg', descripcion: 'Pantalón de lino fresco, corte recto y cómodo. Perfecto para los días de calor.', stock: 9, categoria: 'pantalones', talles: ropa },
    { nombre: 'Sandalias de verano', precio: 29000, imagen: '/img/productos/calzado.jpg', descripcion: 'Sandalias cómodas y livianas, pensadas para el día a día en la temporada cálida.', stock: 6, categoria: 'calzados', talles: calzado },
    { nombre: 'Cartera Mini', precio: 34900, descripcion: 'Cartera chica de mano con correa desmontable.', stock: 6, categoria: 'accesorios', talles: ['Único'] },
  ];
  const prod: number[] = [];
  for (const { categoria, talles, ...datos } of productos) {
    const p = await prisma.producto.create({
      data: { ...datos, categoriaId: cat[categoria], talles: { connect: talles.map((t) => ({ id: talle[t] })) } },
    });
    prod.push(p.id);
  }

  // ---------- Usuarios: 2 admin y 5 clientes (contraseñas encriptadas con bcrypt) ----------
  const admin = await bcrypt.hash('admin123', 10);
  const cliente = await bcrypt.hash('cliente123', 10);
  const usuarios = [
    { nombre: 'Claudia', email: 'claudia@claudette.com', password: admin, rol: 'admin' },
    { nombre: 'Admin Ventas', email: 'ventas@claudette.com', password: admin, rol: 'admin' },
    { nombre: 'Sofía Martínez', email: 'sofia.martinez@email.com', password: cliente },
    { nombre: 'Lucía Fernández', email: 'lucia.f@email.com', password: cliente },
    { nombre: 'Camila Gómez', email: 'camila.gomez@email.com', password: cliente },
    { nombre: 'Valentina Rossi', email: 'vale.rossi@email.com', password: cliente },
    { nombre: 'Martina López', email: 'martina.lopez@email.com', password: cliente },
  ];
  const usr: number[] = [];
  for (const u of usuarios) usr.push((await prisma.usuario.create({ data: u })).id);
  const [, , sofia, lucia, camila, valentina, martina] = usr;

  // ---------- Carritos (uno por clienta) ----------
  const item = (p: number, t: string, cantidad: number) => ({
    productoId: prod[p], talleId: talle[t], cantidad, precioUnitario: productos[p].precio,
  });
  const carritos = [
    { usuarioId: sofia, estado: 'activo', items: [item(0, 'M', 1), item(6, 'S', 2)] },
    { usuarioId: lucia, estado: 'activo', items: [item(2, 'L', 1)] },
    { usuarioId: camila, estado: 'confirmado', items: [item(9, '38', 1), item(10, 'Único', 1)] },
    { usuarioId: valentina, estado: 'activo', items: [item(3, 'M', 1)] },
    { usuarioId: martina, estado: 'cancelado', items: [item(4, 'S', 3)] },
  ];
  for (const { items, ...c } of carritos) {
    await prisma.carrito.create({ data: { ...c, items: { create: items } } });
  }

  // ---------- Mensajes de contacto: 4 de clientas registradas y 2 sin cuenta ----------
  await prisma.contacto.createMany({
    data: [
      { usuarioId: sofia, nombre: 'Sofía Martínez', email: 'sofia.martinez@email.com', motivo: 'talles', mensaje: '¿El Vestido Floral viene en talle L?' },
      { usuarioId: lucia, nombre: 'Lucía Fernández', email: 'lucia.f@email.com', motivo: 'envios', mensaje: '¿Hacen envíos a Yerba Buena?' },
      { usuarioId: camila, nombre: 'Camila Gómez', email: 'camila.gomez@email.com', motivo: 'cambios', mensaje: 'Quiero cambiar las sandalias por un talle más.' },
      { usuarioId: sofia, nombre: 'Sofía Martínez', email: 'sofia.martinez@email.com', motivo: 'consulta', mensaje: '¿Cuándo llegan los abrigos de temporada?' },
      { nombre: 'Ana Ruiz', email: 'ana.ruiz@email.com', motivo: 'consulta', mensaje: '¿Cuál es el horario del local?' },
      { nombre: 'Paula Díaz', email: 'paula.diaz@email.com', telefono: '+54 9 381 777-8888', motivo: 'consulta', mensaje: '¿Aceptan transferencia?' },
    ],
  });

  console.table({
    categorias: await prisma.categoria.count(),
    talles: await prisma.talle.count(),
    productos: await prisma.producto.count(),
    usuarios: await prisma.usuario.count(),
    carritos: await prisma.carrito.count(),
    itemsCarrito: await prisma.itemCarrito.count(),
    contactos: await prisma.contacto.count(),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
