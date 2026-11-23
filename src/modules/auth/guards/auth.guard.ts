import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

// Datos que guardamos dentro del token JWT.
export interface PayloadJwt {
  sub: number; // id del usuario
  email: string;
  rol: string; // 'admin' o 'cliente'
}

// Protege una ruta: solo deja pasar si llega un token JWT válido
// en el header "Authorization: Bearer <token>".
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { usuario?: PayloadJwt }>();
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta el token. Iniciá sesión en POST /auth/login');
    }
    try {
      request.usuario = await this.jwt.verifyAsync<PayloadJwt>(token);
    } catch {
      throw new UnauthorizedException('El token no es válido o venció');
    }
    return true;
  }
}
