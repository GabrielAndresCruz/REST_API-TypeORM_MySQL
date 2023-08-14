import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { ResponseUtl } from "../../utils/Response";
import { Paginator } from "../../database/Paginator";
import { validate } from "class-validator";
import { Book } from "../../database/entities/Book";
import { CreateBookDTO, UpdateBookDTO } from "../dtos/CreateBookDTO";
import { ImageUtil } from "../../utils/Image";

export class BooksController {
  async get(req: Request, res: Response) {
    try {
      const builder = await AppDataSource.getRepository(Book)
        .createQueryBuilder("book")
        .leftJoinAndSelect("book.author", "author")
        .orderBy("book.id", "DESC");
      const { records: books, paginationInfo } = await Paginator.paginate(
        builder,
        req
      );
      const bookData = books.map((book: Book) => {
        return book.toPayload();
      });
      return ResponseUtl.sendResponse<Book>(
        res,
        "Fetched books successfully",
        bookData,
        paginationInfo
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to fetch books", 404, error);
    }
  }

  async getBook(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const book = await AppDataSource.getRepository(Book).findOneByOrFail({
        id: Number(id),
      });

      book.image = ImageUtil.prepareUrl("books", book.image);

      return ResponseUtl.sendResponse<Partial<Book>>(
        res,
        "Fetch book successfully",
        book.toPayload()
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to fetch book", 404, error);
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const bookData = req.body;
      bookData.image = req.file?.filename;

      const dto = new CreateBookDTO();
      Object.assign(dto, bookData);
      dto.price = parseInt(bookData.price);
      dto.authorId = parseInt(bookData.authorId);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return ResponseUtl.sendError(res, "Invalid data", 422, errors);
      }

      const repo = AppDataSource.getRepository(Book);
      const book = repo.create(bookData);
      await repo.save(book);

      return ResponseUtl.sendResponse<Book>(
        res,
        "Book created successfully",
        book[0]
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to create book", 404, error);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const bookData = req.body;

      const dto = new UpdateBookDTO();
      Object.assign(dto, bookData);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return ResponseUtl.sendError(res, "Invalid data", 422, errors);
      }

      const repo = AppDataSource.getRepository(Book);
      const book = await repo.findOneByOrFail({
        id: Number(id),
      });

      repo.merge(book, bookData);
      await repo.save(book);

      return ResponseUtl.sendResponse<Book>(
        res,
        "Book updated successfully",
        book
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to update book", 404, error);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(Book);
      const book = await repo.findOneByOrFail({
        id: Number(id),
      });
      await repo.remove(book);
      return ResponseUtl.sendResponse<Book>(
        res,
        "Book deleted successfully",
        book
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to delete author", 404, error);
    }
  }
}
