# Claudette — Backend

API de **Claudette**, una tienda de ropa y accesorios de mujer de San Miguel de Tucumán. Este backend va a reemplazar los datos que hoy el frontend guarda en archivos locales y en el navegador (productos, clientes, login del administrador y formulario de contacto).

Este es el **Repositorio N.º 3** del proyecto:

| N.º | Repositorio | Contenido |
|---|---|---|
| 1 | [tp-programacion](https://github.com/alvsantillan/tp-programacion) | Sitio en HTML, CSS y JavaScript |
| 2 | [claudette-fronted](https://github.com/newton852161/claudette-fronted) | Migración del frontend a React + Vite |
| 3 | [claudette-backend](https://github.com/Desiree-max623/claudette-backend) (este) | Backend con Nest.js |

## Estado actual

En esta etapa el repositorio contiene **solamente la estructura de carpetas y módulos**, sin código. Las carpetas vacías tienen un archivo `.gitkeep` para que Git pueda subirlas (Git no guarda carpetas vacías). Esos archivos se borran cuando la carpeta tenga contenido real.

## Tecnologías previstas

- [Node.js](https://nodejs.org/) 20 o superior
- [Nest.js](https://nestjs.com/) con TypeScript

## Módulos

Todos los módulos van dentro de `src/modules/`.

| Módulo | Para qué sirve | Lo usa en el frontend |
|---|---|---|
| `app` | Módulo principal, une a todos los demás | — |
| `productos` | Alta, baja, edición y listado de productos | Catálogo, detalle de producto, admin de productos |
| `categorias` | Remeras, vestidos, pantalones, abrigos y calzados | Páginas de categoría y filtros del catálogo |
| `clientes` | Datos de las clientas y sus compras | Admin de clientes |
| `usuarios` | Cuentas de las administradoras | Login del admin |
| `auth` | Inicio de sesión y protección de rutas | Login y rutas protegidas del admin |
| `contacto` | Consultas enviadas desde el formulario | Página de contacto |

## Estructura de carpetas

```
claudette-backend/
├── src/
│   ├── modules/
│   │   ├── app/              # Módulo principal
│   │   ├── auth/
│   │   │   ├── dto/          # Datos que llegan en el login
│   │   │   └── guards/       # Protección de rutas del admin
│   │   ├── usuarios/
│   │   │   ├── dto/
│   │   │   └── entities/     # Cómo se guarda una administradora
│   │   ├── productos/
│   │   │   ├── dto/          # Datos para crear o editar un producto
│   │   │   └── entities/     # Cómo se guarda un producto
│   │   ├── categorias/
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── clientes/
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   └── contacto/
│   │       ├── dto/          # Datos del formulario de contacto
│   │       └── entities/
│   ├── common/               # Piezas compartidas entre módulos
│   └── config/               # Configuración general (variables de entorno, base de datos)
├── test/                     # Pruebas
├── .gitignore
└── README.md
```

## Forma de trabajo

- `main`: versión estable. No se trabaja directo sobre esta rama.
- `dev`: rama de integración. Todos los cambios llegan acá por Pull Request.
- Ramas de trabajo, creadas siempre desde `dev`:
  - `feature/...` para algo nuevo (ej. `feature/modulo-productos`)
  - `refactor/...` para reorganizar sin cambiar lo que hace
  - `fix/...` para corregir errores
  - `docs/...` para documentación (ej. `docs/readme`)

Pasos para colaborar:

```bash
git clone https://github.com/Desiree-max623/claudette-backend.git
cd claudette-backend
git checkout dev
git pull
git checkout -b feature/nombre-de-la-tarea
# ...hacer los cambios...
git add .
git commit -m "feat: descripción corta"
git push -u origin feature/nombre-de-la-tarea
```

Después se abre un Pull Request hacia `dev` en GitHub y otra persona del equipo lo revisa antes de unirlo.

## Equipo — Comisión 6

- David Villarreal
- Alvaro Santillán
- Desiree Sanchez
- Patricio Yuretic
- Paez Ignacio
