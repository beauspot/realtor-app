/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthController } from 'src/user/auth/auth.controller';
import { AuthService } from './user/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { UserInterceptor } from 'src/interceptors/user.interceptors';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    {
      // impolementing the interceptors
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
})
export class AppModule {}
