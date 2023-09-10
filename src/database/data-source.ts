import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Author } from "./entities/Author";
import { Book } from "./entities/Book";
import { User } from "./entities/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1", // This IP direction is for locally running db and server. If you have a deployed server, you must be change the host server direction.
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: ["query"],
  synchronize: false, //synchronize - Indicates if database schema should be auto created on every application launch. Be careful with this option and don't use this in production - otherwise you can lose production data. This option is useful during debug and development. As an alternative to it, you can use CLI and run schema:sync command.
  entities: [Author, Book, User],
  subscribers: [],
  migrations: ["src/database/migrations/*.ts"],
});
