import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Author } from "../../database/entities/Author";
import { ResponseUtl } from "../../utils/Response";
import { Paginator } from "../../database/Paginator";
import { CreateAuthorDTO, UpdateAuthorDTO } from "../dtos/CreateAuthorDTO";
import { validate, validateOrReject } from "class-validator";

export class AuthorsController {
  async getAuthors(req: Request, res: Response) {
    try {
      // const authors = await AppDataSource.getRepository(Author).find();
      const builder = await AppDataSource.getRepository(Author)
        .createQueryBuilder()
        .orderBy("id", "DESC");
      const { records: authors, paginationInfo } = await Paginator.paginate(
        builder,
        req
      );
      return ResponseUtl.sendResponse<Author>(
        res,
        "Fetched authors successfully",
        authors,
        paginationInfo
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to fetch authors", 404, error);
    }
  }

  async getAuthor(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const author = await AppDataSource.getRepository(Author).findOneByOrFail({
        id: Number(id),
      });
      return ResponseUtl.sendResponse<Author>(
        res,
        "Fetch author successfully",
        author
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to fetch author", 404, error);
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
