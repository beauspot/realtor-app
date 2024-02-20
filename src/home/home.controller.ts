/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  ParseIntPipe,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  HomeResponseDTO,
  CreateHomeDto,
  UpdateHomeDTO,
} from 'src/dto/home.dto';
import { PropertyType, UserType } from '.prisma/client';
import { User } from 'src/decorators/user.decorators';
import { UserInfo } from 'src/interface/userType';
import { AuthGuard } from 'src/guards/auth.guards';
import { Roles } from 'src/decorators/roles.decorators';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('property') propertyType?: PropertyType,
  ): Promise<HomeResponseDTO[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHome(@Param('id') id: number) {
    return this.homeService.getHomeById(id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
    // console.log(user);
    // console.log('User Role:', user);
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeID(id);

    if (realtor.id !== user.id) throw new UnauthorizedException();
    return this.homeService.updateHomeById(id, body);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeID(id);
    if (realtor.id !== user.id) throw new UnauthorizedException();
    return this.homeService.deleteHomeById(id);
  }

  @Get('/me')
  me(@User() user: UserInfo) {
    return user;
  }
}
