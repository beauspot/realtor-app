/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpParams } from 'src/interface/signupparams';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({ email, password, name, phone_no }: SignUpParams) {
    // checking for the existence of the user via unique email
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      throw new ConflictException();
    }

    // Hashing the passwords
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log({ hashedPassword });

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone_no,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });
    const token = await jwt.sign(
      {
        id: newUser.id,
        name,
        email,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );
    return { token };
  }
}
