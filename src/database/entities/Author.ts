import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { Book } from "./Book";
import { ImageUtil } from "../../utils/Image";

@Entity(DBTable.AUTHORS)
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany((type) => Book, (book) => book.author, { eager: false })
  books: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  toPayload(): Author {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      bio: this.bio,
      image: ImageUtil.prepareUrl(DBTable.AUTHORS, this.image),
      createdAt: this.createdAt,
      updateAt: this.updateAt,
    } as Author;
  }
}
