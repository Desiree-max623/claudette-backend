-- =========================================================
-- Base de datos de Claudette (PostgreSQL)
-- =========================================================

DROP TABLE IF EXISTS consultas, producto_talles, productos, talles, categorias, clientes, usuarios CASCADE;

-- ---------- TABLAS ----------

CREATE TABLE categorias (
  id      SERIAL PRIMARY KEY,
  slug    VARCHAR(50)  NOT NULL UNIQUE,
  nombre  VARCHAR(100) NOT NULL
);

CREATE TABLE productos (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100)  NOT NULL,
  precio        NUMERIC(10,2) NOT NULL CHECK (precio > 0),
  imagen        VARCHAR(255),
  descripcion   TEXT,
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  destacado     BOOLEAN NOT NULL DEFAULT FALSE,
  estado        VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Pausado')),
  categoria_id  INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT
);

CREATE TABLE talles (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE producto_talles (
  producto_id  INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  talle_id     INTEGER NOT NULL REFERENCES talles(id)    ON DELETE CASCADE,
  PRIMARY KEY (producto_id, talle_id)
);

CREATE TABLE clientes (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL UNIQUE,
  telefono  VARCHAR(30),
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE usuarios (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  rol       VARCHAR(20)  NOT NULL DEFAULT 'admin' CHECK (rol IN ('admin', 'editor'))
);

CREATE TABLE consultas (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  telefono    VARCHAR(30),
  motivo      VARCHAR(50)  NOT NULL,
  mensaje     TEXT         NOT NULL,
  cliente_id  INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
  creado_en   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------- DATOS DE EJEMPLO ----------

INSERT INTO categorias (slug, nombre) VALUES
  ('remeras',    'Remeras'),
  ('vestidos',   'Vestidos'),
  ('pantalones', 'Pantalones'),
  ('abrigos',    'Abrigos'),
  ('calzado',    'Calzado'),
  ('accesorios', 'Accesorios');

INSERT INTO productos (nombre, precio, imagen, descripcion, stock, destacado, estado, categoria_id) VALUES
  ('Vestido Floral',      45900, '/img/ui/claudete-vestido.jpg',        'Vestido floral de temporada, ideal para ocasiones especiales.', 8, TRUE, 'Activo', 2),
  ('Blusa Elegance',      32500, '/img/productos/Remera.jpeg',          'Blusa elegante y cómoda para combinar con diferentes prendas.', 12, TRUE, 'Activo', 1),
  ('Jean Classic',        52900, '/img/productos/Pantalon.jpeg',        'Jean clásico de corte moderno y cómodo.', 10, TRUE, 'Activo', 3),
  ('Campera Urbana',      78900, '/img/ui/campera-jean-claudette.jpg',  'Campera urbana para los días fríos.', 5, TRUE, 'Activo', 4),
  ('Top Básico',          19900, '/img/productos/images.jpg',           'Top básico y versátil para cualquier ocasión.', 15, FALSE, 'Activo', 1),
  ('Abrigo Soft',         89900, '/img/productos/abrigo.jpeg',          'Abrigo cómodo y moderno para la temporada de invierno.', 4, FALSE, 'Pausado', 4),
  ('Remera básica',       18500, '/img/productos/Remera.jpeg',          'Remera de algodón suave, corte clásico. Combina con todo y es ideal para el uso diario.', 20, FALSE, 'Activo', 1),
  ('Vestido floreado',    45000, '/img/ui/claudete-vestido.jpg',        'Vestido floreado de tela liviana, corte suelto y mangas cortas. Ideal para primavera y verano.', 7, FALSE, 'Activo', 2),
  ('Pantalón de lino',    38000, '/img/productos/Pantalon.jpeg',        'Pantalón de lino fresco, corte recto y cómodo. Perfecto para los días de calor.', 9, FALSE, 'Activo', 3),
  ('Sandalias de verano', 29000, '/img/productos/calzado.jpg',          'Sandalias cómodas y livianas, pensadas para el día a día en la temporada cálida.', 6, FALSE, 'Activo', 5),
  ('Cartera Mini',        34900, NULL,                                  'Cartera chica de mano con correa desmontable.', 6, FALSE, 'Activo', 6);

INSERT INTO talles (nombre) VALUES
  ('S'), ('M'), ('L'), ('36'), ('37'), ('38'), ('39'), ('40'), ('Único');

INSERT INTO producto_talles (producto_id, talle_id)
SELECT p.id, t.id
FROM productos p
JOIN categorias c ON c.id = p.categoria_id
JOIN talles t ON (c.slug = 'calzado'    AND t.nombre IN ('36', '37', '38', '39', '40'))
             OR (c.slug = 'accesorios' AND t.nombre = 'Único')
             OR (c.slug NOT IN ('calzado', 'accesorios') AND t.nombre IN ('S', 'M', 'L'));

INSERT INTO clientes (nombre, email, telefono) VALUES
  ('Sofía Martínez',  'sofia.martinez@email.com', '+54 9 381 456-7890'),
  ('Lucía Fernández', 'lucia.f@email.com',        '+54 9 381 234-5678'),
  ('Camila Gómez',    'camila.gomez@email.com',   '+54 9 381 987-6543'),
  ('Valentina Rossi', 'vale.rossi@email.com',     '+54 9 381 333-4444'),
  ('Martina López',   'martina.lopez@email.com',  '+54 9 381 555-1212');

INSERT INTO usuarios (nombre, email, password, rol) VALUES
  ('Claudia',      'claudia@claudette.com',   'cambiar123', 'admin'),
  ('Admin Ventas', 'ventas@claudette.com',    'cambiar123', 'editor'),
  ('Admin Stock',  'stock@claudette.com',     'cambiar123', 'editor'),
  ('Admin Redes',  'redes@claudette.com',     'cambiar123', 'editor'),
  ('Soporte',      'soporte@claudette.com',   'cambiar123', 'admin');

INSERT INTO consultas (nombre, email, telefono, motivo, mensaje, cliente_id) VALUES
  ('Sofía Martínez',  'sofia.martinez@email.com', '+54 9 381 456-7890', 'talles',   '¿El Vestido Floral viene en talle L?', 1),
  ('Lucía Fernández', 'lucia.f@email.com',        '+54 9 381 234-5678', 'envios',   '¿Hacen envíos a Yerba Buena?', 2),
  ('Ana Ruiz',        'ana.ruiz@email.com',       NULL,                 'consulta', '¿Cuál es el horario del local?', NULL),
  ('Camila Gómez',    'camila.gomez@email.com',   '+54 9 381 987-6543', 'cambios',  'Quiero cambiar un jean por un talle más.', 3),
  ('Paula Díaz',      'paula.diaz@email.com',     '+54 9 381 777-8888', 'consulta', '¿Aceptan transferencia?', NULL);

-- ---------- VERIFICACIÓN ----------

SELECT 'categorias' AS tabla, COUNT(*) FROM categorias
UNION ALL SELECT 'productos', COUNT(*) FROM productos
UNION ALL SELECT 'talles', COUNT(*) FROM talles
UNION ALL SELECT 'producto_talles', COUNT(*) FROM producto_talles
UNION ALL SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL SELECT 'consultas', COUNT(*) FROM consultas;

SELECT p.nombre AS producto, c.nombre AS categoria, p.precio, p.destacado, p.estado
FROM productos p JOIN categorias c ON c.id = p.categoria_id
ORDER BY c.nombre, p.nombre;
