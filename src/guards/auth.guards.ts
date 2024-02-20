/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

// this auth-guard checks the authorization and authentication of a user
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Allows us to access metadata
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    // 1. determine the user type that can execute the called endpoint
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log({ roles });
    if (roles?.length) {
      // 2. Grab the JWT from the request header and verify it
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        const payload = jwt.verify(
          token,
          process.env.JSON_TOKEN_KEY,
        ) as JWTPayload;
        // console.log({ payload });
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });
        // console.log('User from Database:', user);
        if (!user) return false;
        // console.log({ user });
        if (roles.includes(user.user_type)) return true;
        return false;
      } catch (error) {
        return false;
      }
    }
    return true;
  }
}
