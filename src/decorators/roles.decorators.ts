// Creating a custom decorator
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { UserType } from '.prisma/client';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
