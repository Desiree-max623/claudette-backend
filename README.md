# Claudette — Backend

API de **Claudette**, una tienda de ropa y accesorios de mujer de San Miguel de Tucumán. Este backend reemplaza los datos que hoy el frontend guarda en archivos locales y en el navegador: productos, categorías, clientes, login del administrador y formulario de contacto.

Este es el **Repositorio N.º 3** del proyecto:

| N.º | Repositorio | Contenido |
|---|---|---|
| 1 | [tp-programacion](https://github.com/alvsantillan/tp-programacion) | Sitio en HTML, CSS y JavaScript |
| 2 | [claudette-fronted](https://github.com/newton852161/claudette-fronted) | Migración del frontend a React + Vite |
| 3 | [claudette-backend](https://github.com/Desiree-max623/claudette-backend) (este) | Backend con Nest.js |

## Estado actual (TP N.º 9)

El proyecto tiene la **estructura completa** generada con Nest CLI: un módulo por recurso, cada uno con su controlador, servicio, DTO y entidad. Los endpoints responden con los textos de ejemplo que genera Nest; **todavía no tienen lógica de negocio ni conexión a la base de datos**, como pide esta etapa.

## Tecnologías

- [Node.js](https://nodejs.org/) 20 o superior
- [Nest.js](https://nestjs.com/) con TypeScript
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) para leer el archivo `.env`
- [PostgreSQL](https://www.postgresql.org/) como base de datos relacional
- [Postman](https://www.postman.com/) para documentar y probar los endpoints

## Instalación y ejecución

```bash
git clone https://github.com/Desiree-max623/claudette-backend.git
cd claudette-backend
npm install
cp .env.example .env     # y completar .env con los datos de cada uno
npm run start:dev
```

Después abrir `http://localhost:4000` en el navegador: tiene que aparecer **Hello World!**

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Levanta el servidor y se reinicia solo al guardar cambios |
| `npm run build` | Compila el proyecto en `dist/` |
| `npm run start:prod` | Ejecuta la versión compilada |

## Variables de entorno

Las variables van en un archivo `.env` en la raíz del proyecto. Ese archivo **no se sube a GitHub** (está en el `.gitignore`) porque tiene contraseñas. En su lugar se sube **`.env.example`**, con los mismos nombres de variables y valores de ejemplo: cada integrante lo copia como `.env` y pone sus propios datos.

| Variable | Para qué sirve | Ejemplo |
|---|---|---|
| `PORT` | Puerto donde corre la API | `4000` |
| `DATABASE_URL` | Conexión a la base de datos | `postgresql://usuario:password@localhost:5432/claudette_db` |
| `API_BASE_URL` | Dirección base de la API | `http://localhost:4000/` |

## Módulos y endpoints

Todos los módulos están en `src/modules/` y declarados en `imports` del `AppModule` (`src/modules/app/app.module.ts`). Cada recurso tiene las 5 operaciones CRUD:

| Módulo | Ruta base | Lo usa en el frontend |
|---|---|---|
| `app` | `/` | Módulo principal: une a todos los demás |
| `productos` | `/productos` | Catálogo, detalle de producto, admin de productos |
| `categorias` | `/categorias` | Páginas de categoría y filtros del catálogo |
| `clientes` | `/clientes` | Admin de clientes |
| `usuarios` | `/usuarios` | Cuentas del admin |
| `auth` | `/auth` | Login y rutas protegidas del admin |
| `contacto` | `/contacto` | Formulario de contacto |

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/productos` | Listar todos |
| `GET` | `/productos/:id` | Ver uno |
| `POST` | `/productos` | Crear |
| `PATCH` | `/productos/:id` | Editar |
| `DELETE` | `/productos/:id` | Borrar |

(Lo mismo para cada módulo, cambiando la ruta base.)

## Estructura de carpetas

```
claudette-backend/
├── database/
│   └── claudette.sql             # Tablas, relaciones y datos de ejemplo
├── postman/
│   └── claudette-backend.postman_collection.json
├── src/
│   ├── main.ts                   # Punto de entrada: arranca la aplicación
│   └── modules/
│       ├── app/                  # Módulo principal
│       │   ├── app.controller.ts
│       │   ├── app.module.ts     # Importa a todos los módulos
│       │   └── app.service.ts
│       ├── productos/
│       │   ├── dto/              # Datos que llegan (crear / editar)
│       │   ├── entities/         # Cómo es un producto
│       │   ├── productos.controller.ts   # Recibe las peticiones (rutas)
│       │   ├── productos.module.ts       # Une controlador y servicio
│       │   └── productos.service.ts      # Acá irá la lógica
│       ├── categorias/           # Misma estructura
│       ├── clientes/
│       ├── usuarios/
│       ├── auth/
│       └── contacto/
├── test/                         # Pruebas
├── .env.example                  # Modelo de variables de entorno
├── .gitignore
├── nest-cli.json
├── package.json
└── README.md
```

## Base de datos

Se usa **PostgreSQL**. El script `database/claudette.sql` crea las tablas, sus relaciones y restricciones, y carga datos de ejemplo (los productos y categorías del frontend, más la categoría Accesorios). Todas las tablas tienen 5 registros o más.

| Tabla | Qué guarda | Relaciones |
|---|---|---|
| `categorias` | Remeras, vestidos, pantalones, abrigos, calzado y accesorios | — |
| `productos` | Productos de la tienda (con stock, destacado y estado Activo/Pausado) | `categoria_id` → `categorias` |
| `talles` | S, M, L, 36 a 40 y Único | — |
| `producto_talles` | Qué talles tiene cada producto | `producto_id` → `productos`, `talle_id` → `talles` |
| `clientes` | Clientas | — |
| `usuarios` | Cuentas del admin | — |
| `consultas` | Mensajes del formulario de contacto | `cliente_id` → `clientes` (opcional) |

Para crearla: en pgAdmin, crear la base `claudette_db`, abrir **Query Tool**, cargar `database/claudette.sql` y ejecutarlo. Al final muestra cuántos registros tiene cada tabla.

## Pruebas con Postman

La colección `postman/claudette-backend.postman_collection.json` tiene todos los endpoints organizados por módulo. Para usarla: en Postman, **Import** → elegir el archivo. Usa la variable `{{baseUrl}}` (por defecto `http://localhost:4000`).

## Forma de trabajo

- `main`: versión estable. No se trabaja directo sobre esta rama.
- `dev`: rama de integración. Todos los cambios llegan acá por Pull Request.
- Ramas de trabajo, creadas siempre desde `dev`:
  - `feature/nombre-funcionalidad` para algo nuevo (ej. `feature/modulo-productos`)
  - `fix/nombre-correccion` para corregir errores
  - `refactor/nombre-cambio` para reorganizar o mejorar código
  - `docs/nombre-documentacion` para documentación

Cada Pull Request lo revisa y aprueba **otro** integrante del equipo.

## Equipo — Comisión 6

- David Villarreal
- Alvaro Santillán
- Desiree Sanchez
- Patricio Yuretic
- Paez Ignacio
