import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private usersSrevice: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersSrevice.getAllUsers();
  }

  @Post()
  addUser(@Body() createUserDto: CreateUserDto) {
    return this.usersSrevice.addUser(createUserDto);
  }
}
