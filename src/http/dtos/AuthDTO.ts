import { MaxLength, MinLength, IsEmail, IsNotEmpty } from "class-validator";
import { IsUnique } from "../validators/IsUniqueValidator";
import { User } from "../../database/entities/User";

export class RegisterDTO {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique(User, "email")
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}
