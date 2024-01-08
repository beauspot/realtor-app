/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Controller, Post, Put, Get, Delete, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from 'src/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  signup(@Body() body: SignUpDTO) {
    return this.authService.signup(body);
  }
}
//signup
