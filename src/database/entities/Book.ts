import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { Author } from "./Author";
import { ImageUtil } from "../../utils/Image";

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

  @Column({ nullable: false })
  authorId: number;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  toPayload(): Partial<Book> {
    return {
      id: this.id,
      title: this.title,
      image: ImageUtil.prepareUrl(DBTable.BOOKS, this.image),
      description: this.description,
      author: this.author.toPayload(),
      price: this.price,
      category: this.category,
      createdAt: this.createdAt,
      updateAt: this.updateAt,
    };
  }
}
