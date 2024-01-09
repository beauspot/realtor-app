/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { UserType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  // @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
  //   message: 'Phone must be a valid phone number',
  // })
  phone_no: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class SignInDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class GenerateProductKeyDTO {
  @IsEmail()
  @IsString()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
