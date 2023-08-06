import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Author } from "../../database/entities/Author";
import { ResponseUtl } from "../../utils/Response";
import { Paginator } from "../../database/Paginator";
import { CreateAuthorDTO, UpdateAuthorDTO } from "../dtos/CreateAuthorDTO";
import { validate, validateOrReject } from "class-validator";
import { Book } from "../../database/entities/Book";

export class BooksController {
  async get(req: Request, res: Response) {
    try {
      const builder = await AppDataSource.getRepository(Book)
        .createQueryBuilder()
        .orderBy("id", "DESC");
      const { records: books, paginationInfo } = await Paginator.paginate(
        builder,
        req
      );
      return ResponseUtl.sendResponse<Book>(
        res,
        "Fetched books successfully",
        books,
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
      return ResponseUtl.sendResponse<Book>(
        res,
        "Fetch book successfully",
        book
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to fetch book", 404, error);
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const authorData = req.body;
      authorData.image = req.file?.filename;

      const dto = new CreateAuthorDTO();
      Object.assign(dto, authorData);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return ResponseUtl.sendError(res, "Invalid data", 422, errors);
      }

      const repo = AppDataSource.getRepository(Author);
      const author = repo.create(authorData);
      await repo.save(author);

      return ResponseUtl.sendResponse<Author>(
        res,
        "Author created successfully",
        author[0]
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to create author", 404, error);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const authorData = req.body;

      console.log(id, authorData);
      const dto = new UpdateAuthorDTO();
      Object.assign(dto, authorData);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return ResponseUtl.sendError(res, "Invalid data", 422, errors);
      }

      // await validateOrReject(dto);

      const repo = AppDataSource.getRepository(Author);
      const author = await repo.findOneByOrFail({
        id: Number(id),
      });

      repo.merge(author, authorData);
      await repo.save(author);

      return ResponseUtl.sendResponse<Author>(
        res,
        "Author updated successfully",
        author
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to update author", 404, error);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(Author);
      const author = await repo.findOneByOrFail({
        id: Number(id),
      });
      await repo.remove(author);
      return ResponseUtl.sendResponse<Author>(
        res,
        "Author deleted successfully",
        author
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to delete author", 404, error);
    }
  }
}
