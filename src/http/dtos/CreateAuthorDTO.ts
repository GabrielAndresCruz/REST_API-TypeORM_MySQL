import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from "class-validator";
import { IsUnique } from "../validators/IsUniqueValidator";
import { Author } from "../../database/entities/Author";

export class CreateAuthorDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique(Author, "email")
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio: string;
}

export class UpdateAuthorDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique(Author, "email")
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio: string;
}
