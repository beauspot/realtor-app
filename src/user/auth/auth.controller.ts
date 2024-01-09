/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  ParseEnumPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO, SignInDTO, GenerateProductKeyDTO } from 'src/dto/auth.dto';
import { UserType } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  signup(
    @Body() body: SignUpDTO,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SignInDTO) {
    return this.authService.signInUser(body);
  }

  @Post('/key')
  // the body can be destructured
  // {email, body}
  generateProductKey(@Body() body: GenerateProductKeyDTO) {
    return this.authService.generate_product_key(body.email, body.userType);
  }
}
