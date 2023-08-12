import { NextFunction, Request, Response } from "express";
import { ResponseUtl } from "../../utils/Response";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";

export class AuthMiddleware {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    const tokenHeader = req.cookies["accessToken"];
    if (!tokenHeader) {
      return ResponseUtl.sendError(res, "Token not provided", 401, null);
    }
    console.log(tokenHeader);
    const token = tokenHeader.split(" ")[1];
    console.log(token);

    try {
      const decoded = jwt.verify(tokenHeader, "access_secret");
      //@ts-ignore
      const { userId: id } = decoded;
      const repo = AppDataSource.getRepository(User);
      const user = await repo.findOneByOrFail({ id });
      //@ts-ignore
      req.user = user;
    } catch (error) {
      return ResponseUtl.sendError(res, "Invalid token", 401, null);
    }
    next();
  }
}
