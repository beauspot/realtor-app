/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { PropertyType } from '@prisma/client';

export interface getHomesParams {
  city?: string;
  price?: {
    gte?: number;
    let?: number;
  };
  propertyType?: PropertyType;
}
