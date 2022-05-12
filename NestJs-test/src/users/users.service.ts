import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  getAllUsers() {
    const testVar = 1;
    return `hello world from service ${testVar}`;
  }

  addUser(createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
