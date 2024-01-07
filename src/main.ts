/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

(async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const Port = configService.get('port');
  await app.listen(Port);
  console.log(`Application is running on: localhost:${Port}`);
})();
