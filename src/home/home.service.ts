/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDTO } from 'src/dto/home.dto';
import { getHomesParams } from 'src/interface/getHomesParams';
import { CreateHomeParams } from 'src/interface/createHomeParams';
import { updateHomeParams } from 'src/interface/updateHome';
// import { PropertyType } from '.prisma/client';

export const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  propertyType: true,
  number_of_bathrooms: true,
  number_of_bedrooms: true,
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  // Getting all homes
  async getHomes(filter: getHomesParams): Promise<HomeResponseDTO[]> {
    try {
      const homes = await this.prismaService.home.findMany({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filter,
      });

      if (!homes.length) {
        throw new NotFoundException();
      }

      return homes.map((home) => {
        const fetchHome = { ...home, image: home.images[0].url };
        delete fetchHome.images;
        return new HomeResponseDTO(fetchHome);
      });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        error.status,
      );
    }
  } // ?//city=Exampleville&minPrice=250000&maxPrice=300000&propertyType=RESIDENTIAL

  async getHomeById(id: number) {
    try {
      const home = await this.prismaService.home.findUnique({
        where: {
          id,
        },
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
          },
          realtor: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      if (!home) {
        throw new NotFoundException();
      }

      return new HomeResponseDTO(home);
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        error.status,
      );
    }
  }

  async createHome(
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      landSize,
      price,
      propertyType,
      images,
    }: CreateHomeParams,
    userId: number,
  ) {
    try {
      const home = await this.prismaService.home.create({
        data: {
          address,
          number_of_bathrooms: numberOfBathrooms,
          number_of_bedrooms: numberOfBedrooms,
          city,
          land_size: landSize,
          propertyType,
          price,
          realtor_id: userId,
        },
      });
      const homeImages = images.map((image) => {
        return { ...image, home_id: home.id };
      });

      await this.prismaService.image.createMany({ data: homeImages });

      return new HomeResponseDTO(home);
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        error.status,
      );
    }
  }

  async updateHomeById(id: number, data: updateHomeParams) {
    try {
      const home = await this.prismaService.home.findUnique({
        where: {
          id,
        },
      });
      if (!home) throw new NotFoundException();

      const updateHome = await this.prismaService.home.update({
        where: {
          id,
        },
        data,
      });
      return new HomeResponseDTO(updateHome);
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        error.status,
      );
    }
  }

  async deleteHomeById(id: number) {
    try {
      await this.prismaService.image.deleteMany({
        where: {
          home_id: id,
        },
      });
      await this.prismaService.home.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        error.status,
      );
    }
  }

  async getRealtorByHomeID(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    if (!home) throw new NotFoundException();
    return home.realtor;
  }
}
