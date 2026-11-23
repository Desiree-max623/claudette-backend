# Claudette — Backend

API de **Claudette**, una tienda de ropa y accesorios de mujer de San Miguel de Tucumán. Guarda en una base de datos PostgreSQL los productos, categorías, usuarios (admins y clientes), carritos de compra y consultas del formulario de contacto, y permite registrarse e iniciar sesión con JWT.

Este es el **Repositorio N.º 3** del proyecto:

| N.º | Repositorio | Contenido |
|---|---|---|
| 1 | [tp-programacion](https://github.com/alvsantillan/tp-programacion) | Sitio en HTML, CSS y JavaScript |
| 2 | [claudette-fronted](https://github.com/newton852161/claudette-fronted) | Migración del frontend a React + Vite |
| 3 | [claudette-backend](https://github.com/Desiree-max623/claudette-backend) (este) | Backend con Nest.js, Prisma y PostgreSQL |

## Qué incluye cada trabajo práctico

| TP | Tema | Qué se hizo |
|---|---|---|
| 9 | Estructura del proyecto | Proyecto Nest, `src/modules`, un módulo por recurso, `.env` |
| 10 | DTO y validación | `class-validator` y `ValidationPipe`; cada módulo con sus DTO validados |
| 11 | Prisma y PostgreSQL | Esquema de Prisma, migración, datos de ejemplo y services con Prisma Client |
| 12 | Autenticación | Registro, login con JWT, contraseñas encriptadas con bcrypt y rutas protegidas |

**Correcciones de la profe:** usuarios y clientes se unificaron en una sola tabla con un `rol` (`admin` o `cliente`), se agregó el carrito, las consultas quedan relacionadas con la clienta que las envía y se reemplazó el módulo `admin` por `auth` (admin es un rol, no un recurso).

## Tecnologías

- [Node.js](https://nodejs.org/) 20 o superior
- [Nest.js](https://nestjs.com/) con TypeScript
- [class-validator](https://github.com/typestack/class-validator) y class-transformer para validar los datos
- [Prisma 7](https://www.prisma.io/) con el adaptador de PostgreSQL (`@prisma/adapter-pg`)
- [PostgreSQL](https://www.postgresql.org/)
- [@nestjs/jwt](https://docs.nestjs.com/security/authentication) y [bcrypt](https://github.com/kelektiv/node.bcrypt.js) para la autenticación
- [Postman](https://www.postman.com/) para probar los endpoints

## Instalación y ejecución

Requisitos: Node.js 20 o superior y PostgreSQL instalado (con una base vacía, por ejemplo `claudette_db`, creada desde pgAdmin).

```bash
git clone https://github.com/Desiree-max623/claudette-backend.git
cd claudette-backend
npm install
npx prisma generate                    # genera Prisma Client (src/generated/prisma)
cp .env.example .env                   # y completar .env con los datos de cada uno
npx prisma migrate dev                 # crea las tablas con la migración del repo
npx prisma db seed                     # carga los datos de ejemplo
npm run start:dev
```

Después abrir `http://localhost:4000` en el navegador: tiene que aparecer **Hello World!**

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Levanta la API y se reinicia sola al guardar cambios |
| `npx prisma validate` | Revisa que el esquema no tenga errores |
| `npx prisma generate` | Genera Prisma Client (hay que correrlo después de cambiar el esquema) |
| `npx prisma migrate dev --name nombre` | Crea y aplica una migración con los cambios del esquema |
| `npx prisma db seed` | Borra los datos y vuelve a cargar los de ejemplo |
| `npx prisma studio` | Abre una página para ver y editar los datos de la base |

## Variables de entorno

Van en el archivo `.env`, que **no se sube a GitHub** porque tiene contraseñas. Se sube `.env.example` con los mismos nombres: cada integrante lo copia como `.env` y pone sus datos.

| Variable | Para qué sirve | Ejemplo |
|---|---|---|
| `PORT` | Puerto de la API | `4000` |
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://postgres:SU_CONTRASENA@localhost:5432/claudette_db?schema=public` |
| `API_BASE_URL` | Dirección base de la API | `http://localhost:4000/` |
| `JWT_SECRET` | Clave para firmar los tokens JWT | una frase larga y secreta |

## Módulos y endpoints

Todos los módulos están en `src/modules/` y declarados en `imports` del `AppModule`.

| Módulo | Ruta base | Lo usa en el frontend |
|---|---|---|
| `auth` | `/auth` | Registro e inicio de sesión |
| `usuarios` | `/usuarios` | Admin de usuarios y clientes |
| `productos` | `/productos` | Catálogo, detalle de producto, admin de productos |
| `categorias` | `/categorias` | Páginas de categoría y filtros |
| `carrito` | `/carrito` | Carrito de compras de cada clienta (requiere token) |
| `contacto` | `/contacto` | Formulario de contacto (mensajes) |

**Auth**

| Método | Ruta | Qué hace |
|---|---|---|
| `POST` | `/auth/register` | Crea una cuenta (siempre como `cliente`). Es la única ruta para crear usuarios. Si el email ya existe responde `409` |
| `POST` | `/auth/login` | Verifica email y contraseña y devuelve un `access_token` (JWT) |

**Usuarios:** `GET /usuarios`, `GET /usuarios/:id`, `PATCH /usuarios/:id`, `DELETE /usuarios/:id`.

**Productos, categorías, carrito y contacto** tienen las 5 operaciones CRUD:

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/productos` | Listar todos |
| `GET` | `/productos/:id` | Ver uno |
| `POST` | `/productos` | Crear |
| `PATCH` | `/productos/:id` | Editar |
| `DELETE` | `/productos/:id` | Borrar |

## Recorrido de una solicitud

1. El **DTO** valida los datos recibidos (si algo está mal, responde `400` con el detalle).
2. El **controller** recibe la solicitud y llama al service.
3. El **service** usa **Prisma Client** para consultar o modificar la base.
4. La API devuelve el resultado. Si la base rechaza la operación, responde un error claro: `404` (no existe), `409` (dato repetido) o `400` (dato relacionado inexistente o en uso).

## Validaciones (TP 10)

En `main.ts` está el `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted` y `transform`: se rechazan los campos que no están en el DTO. Cada módulo tiene sus DTO (`Create...Dto` y `Update...Dto`) con decoradores como `@IsString()`, `@IsInt()`, `@IsEmail()`, `@IsBoolean()`, `@IsIn()`, `@MinLength()` y `@ValidateNested()` (para los productos del carrito). Los `id` de las rutas se validan con `ParseIntPipe`.

## Base de datos con Prisma (TP 11)

- `prisma/schema.prisma`: modelos, campos, tipos y relaciones.
- `prisma.config.ts`: configuración de Prisma 7 (esquema, migraciones, seed y `DATABASE_URL`).
- `prisma/migrations/`: historial de migraciones (la inicial es la misma para todo el equipo).
- `prisma/seed.ts`: datos de ejemplo (todas las tablas con 5 registros o más).
- `src/modules/prisma/`: `PrismaService` (se conecta con el adaptador `PrismaPg`), `PrismaModule` (global) y el filtro que traduce los errores de la base.
- `src/generated/prisma/`: Prisma Client generado. **No se sube**: lo genera cada uno con `npx prisma generate` (y hay que volver a correrlo si cambia el esquema).

```
Usuario (rol: admin | cliente)
   ├──< Carrito ──< ItemCarrito >── Producto, Talle
   └──< Contacto

Categoria ──< Producto >──< Talle
```

| Modelo | Qué guarda | Relaciones |
|---|---|---|
| `Categoria` | Remeras, vestidos, pantalones, abrigos, calzado y accesorios | Tiene muchos productos |
| `Producto` | Productos (precio, stock, destacado, activo) | `categoriaId` → `Categoria`; muchos a muchos con `Talle` |
| `Talle` | S, M, L, 36 a 40 y Único | Muchos a muchos con `Producto` |
| `Usuario` | Admins y clientes (campo `rol`) | Tiene carritos y mensajes |
| `Carrito` | Carrito de cada clienta (activo, confirmado o cancelado) | `usuarioId` → `Usuario` |
| `ItemCarrito` | Productos del carrito con talle, cantidad y precio | → `Carrito`, → `Producto`, → `Talle` |
| `Contacto` | Mensajes del formulario de contacto | `usuarioId` → `Usuario` (opcional, si lo envía una clienta registrada) |

Reglas: el email es único; cada clienta tiene un solo carrito activo; no se puede agregar al carrito un talle que el producto no tiene; no se puede borrar una categoría con productos.

## Autenticación (TP 12)

- **Registro** (`POST /auth/register`): crea el usuario con el modelo y la base existentes. Para no duplicar la operación, se eligió esta ruta y se quitó `POST /usuarios`. Quien se registra queda como `cliente`.
- **Contraseñas:** se guardan encriptadas con **bcrypt** y nunca se devuelven en las respuestas.
- **Login** (`POST /auth/login`): compara la contraseña con bcrypt y devuelve un **JWT** (`access_token`) firmado con `JWT_SECRET`, que dura 1 hora. El token lleva el id, el email y el rol del usuario. Si el email o la contraseña no coinciden responde `401`.
- **Rutas protegidas:** `AuthGuard` (`src/modules/auth/guards/auth.guard.ts`) verifica el token que llega en el header `Authorization: Bearer <token>`. Protege todas las rutas de `/carrito`, porque el carrito es de una clienta que inició sesión. Sin token, o con un token vencido o inválido, responde `401`.

Usuarios de ejemplo (del seed):

| Email | Contraseña | Rol |
|---|---|---|
| `claudia@claudette.com` | `admin123` | admin |
| `sofia.martinez@email.com` | `cliente123` | cliente |

## Pruebas con Postman

La colección `postman/claudette-api.postman_collection.json` tiene una carpeta por módulo. Cada integrante cargó las solicitudes de su módulo, con una descripción (qué hace, qué datos recibe y qué responde) y un ejemplo de respuesta. Hay casos **válidos e inválidos**: campo obligatorio faltante, texto donde va un número, valor que no es `true`/`false`, campo que no está en el DTO, dato relacionado que no existe, id inexistente, etc.

1. Levantar la API (`npm run start:dev`) con los datos del seed cargados.
2. En Postman: **Import** → elegir el archivo de la colección.
3. Abrir cada solicitud y hacer clic en **Send**.

Las rutas del carrito requieren token: en la carpeta `carrito`, enviar primero **Login para el carrito**, que guarda el `access_token` en la variable `{{token}}`; las demás solicitudes del carrito lo usan en **Authorization → Bearer Token**.

## Estructura de carpetas

```
claudette-backend/
├── prisma/
│   ├── schema.prisma         # Modelos y relaciones
│   ├── migrations/           # Historial de migraciones
│   └── seed.ts               # Datos de ejemplo
├── postman/
│   └── claudette-api.postman_collection.json
├── src/
│   ├── main.ts               # Arranca la API (ValidationPipe y filtro de errores de Prisma)
│   └── modules/
│       ├── app/              # Módulo principal: importa a todos los demás
│       ├── prisma/           # PrismaService, PrismaModule y filtro de errores
│       ├── auth/             # Registro, login, JWT y AuthGuard
│       │   ├── dto/          # RegisterDto y LoginDto
│       │   └── guards/       # AuthGuard (rutas protegidas)
│       ├── usuarios/
│       │   ├── dto/          # Datos que llegan (validados)
│       │   ├── entities/     # Cómo es un usuario
│       │   ├── usuarios.controller.ts   # Recibe las solicitudes
│       │   ├── usuarios.module.ts
│       │   └── usuarios.service.ts      # Lógica con Prisma Client
│       ├── productos/        # Misma estructura
│       ├── categorias/
│       ├── carrito/
│       └── contacto/
├── .env.example
├── prisma.config.ts          # Configuración de Prisma 7
└── package.json
```

## Forma de trabajo

- `main`: versión estable. `dev`: rama de integración.
- Ramas de trabajo, creadas desde `dev`: `feature/...`, `fix/...`, `refactor/...` y `docs/...`.
- Cada Pull Request va hacia `dev` y lo aprueba **otro** integrante.

## Equipo — Comisión 6

- David Villarreal
- Alvaro Santillán
- Desiree Sanchez
- Patricio Yuretic
- Paez Ignacio
