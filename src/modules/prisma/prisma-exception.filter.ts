import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../../generated/prisma/client.js';

// Traduce los errores de la base de datos a respuestas HTTP claras,
// en vez de devolver un error 500 genérico.
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const errores: Record<string, [number, string]> = {
      P2002: [HttpStatus.CONFLICT, 'Ya existe un registro con ese valor'],
      P2003: [HttpStatus.BAD_REQUEST, 'El dato relacionado no existe o el registro está en uso'],
      P2025: [HttpStatus.NOT_FOUND, 'No se encontró el registro'],
    };
    const [statusCode, message] = errores[error.code] ?? [HttpStatus.INTERNAL_SERVER_ERROR, 'Error en la base de datos'];
    res.status(statusCode).json({ statusCode, message, error: error.code });
  }
}
