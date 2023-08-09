import { MaxLength, MinLength, IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDTO {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}

export class UpdateDTO {}
