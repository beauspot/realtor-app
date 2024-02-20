/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthController } from 'src/user/auth/auth.controller';
import { AuthService } from './user/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { UserInterceptor } from 'src/interceptors/user.interceptors';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guards';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      // impolementing the interceptors
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      // implementing the guard for authorization
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
