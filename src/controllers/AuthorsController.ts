import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Author } from "../entities/Author";
import { ResponseUtl } from "../../utils/Response";

export class AuthorsController {
  async getAuthors(req: Request, res: Response) {
    try {
      const authors = await AppDataSource.getRepository(Author).find();
      return ResponseUtl.sendResponse<Author>(
        res,
        "Fetched authors successfully",
        authors[0]
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to fetch authors", 404, error);
    }
  }

  async getAuthor(req: Request, res: Response) {
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
}
