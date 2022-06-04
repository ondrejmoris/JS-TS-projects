import { ForbiddenException, Injectable } from "@nestjs/common";
import * as argon from "argon2";
import { UserService } from "src/user/user.service";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { RegisterAuthDto } from "./dto/register-auth.dto";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(dto: LoginAuthDto) {
    const user = await this.userService.findUser(dto.email);

    const pwVertify = await argon.verify(user.password, dto.password);

    if (!pwVertify) throw new ForbiddenException("Credentials incorrect");

    return "login success";
    // create token
  }

  async register(dto: RegisterAuthDto) {
    const hash = await argon.hash(dto.password);

    const user = await this.userService.addUser(hash, dto.email, dto.isCompany);
    console.log(user);
    // create tokens
    return "register success";
  }
}
