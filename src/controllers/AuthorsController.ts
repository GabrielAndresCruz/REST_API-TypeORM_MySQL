import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Author } from "../entities/Author";
import { ResponseUtl } from "../../utils/Response";

export class AuthorsController {
  async getAuthors(req: Request, res: Response) {
    try {
      const authors = await AppDataSource.getRepository(Author).find();
      return res.status(200).json({
        success: true,
        message: "Fetched authors successfully",
        data: authors,
      });
    } catch (error) {
      console.error("Error fetching authors:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch authors",
      });
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
      console.error("Error fetching author:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch author",
      });
    }
  }
}
