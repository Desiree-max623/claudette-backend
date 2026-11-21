import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Configuración de Prisma 7: dónde está el esquema y cómo conectarse a la base.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
