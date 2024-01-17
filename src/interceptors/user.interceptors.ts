/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

// creating a custom interceptor

@Injectable()
export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    // console.log({ request });
    const token = request?.headers?.authorization?.split('Bearer ')[0];
    // console.log({ token });
    const user = jwt.decode(token);
    // console.log({ user });
    request.user = user;

    return handler.handle();
  }
}
