import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsNumber,
} from "class-validator";
import { IsUnique } from "../validators/IsUniqueValidator";
import { Author } from "../../database/entities/Author";
import { Book } from "../../database/entities/Book";

export class CreateBookDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;
}

export class UpdateBookDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsUnique(Book, "title")
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;
}
