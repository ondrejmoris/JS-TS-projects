import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async addUser(hash: string, email: string, isCompany: boolean) {
    try {
      const user = await this.prismaService.user.create({
        data: { email, password: hash, isCompany },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Credentials taken");
        }
      }
      throw error;
    }
  }

  async findUser(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new ForbiddenException("Credentials incorrect");

    return user;
  }
}
