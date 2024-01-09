/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpParams, SignInParams } from 'src/interface/authparams';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  // Signup Service for signing up user
  async signup(
    { email, password, name, phone_no }: SignUpParams,
    userType: UserType,
  ) {
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
        user_type: userType,
      },
    });
    const token = this.generateJWT(newUser.email, newUser.id);
    return { user: { email }, tokenData: token };
  }

  // Signin the user
  async signInUser({ email, password }: SignInParams) {
    // checking for the existence of the user via the email
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new HttpException('Invalid credentials', 400);

    const hashedPwd = user.password;

    // comparing the passwords
    const isValidPwd = await bcrypt.compare(password, hashedPwd);

    if (!isValidPwd) throw new HttpException('Invalid credentials', 400);

    const token = this.generateJWT(user.email, user.id);

    return { user: { userEmail: email }, tokenData: token };
  }

  generate_product_key(email: string, userType: UserType) {
    const userStringToken = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

    return bcrypt.hash(userStringToken, 10);
  }

  // Logic to generate JWT
  private generateJWT(email: string, id: number) {
    return jwt.sign(
      {
        email,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );
  }
}
