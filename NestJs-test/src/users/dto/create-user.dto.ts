import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  fname: string;

  @IsNotEmpty()
  lname: string;
}
