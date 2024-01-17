/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HomeController],
  providers: [
    HomeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class HomeModule {}
