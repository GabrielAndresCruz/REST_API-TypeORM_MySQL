import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { Author } from "./Author";

@Entity(DBTable.BOOKS)
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @ManyToOne((type) => Author, (author) => author.books, { eager: true })
  author: Author;

  @Column({ nullable: true })
  authorId: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updateAt: Date;
}
