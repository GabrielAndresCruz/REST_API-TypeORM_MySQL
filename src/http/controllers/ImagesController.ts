import { NextFunction, Request, Response } from "express";
import { ResponseUtl } from "../../utils/Response";
import path from "path";
import fs from "fs";

export class ImagesController {
  async get(req: Request, res: Response, next: NextFunction) {
    const { type, id } = req.params;
    const imagesTypes = ["authors", "books"];
    if (!imagesTypes.includes(type)) {
      return ResponseUtl.sendError(res, "Invalid image type", 500, null);
    }
    let filePath = path.join(__dirname, "..", "uploads", type, id);

    if (!fs.existsSync(filePath)) {
      return ResponseUtl.sendError(res, "Invalid image", 404, null);
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        return ResponseUtl.sendError(
          res,
          "Error while reading image",
          500,
          null
        );
      }

      res.set("Content-Type", "image/jpeg");
      res.send(data);
    });
  }
}
