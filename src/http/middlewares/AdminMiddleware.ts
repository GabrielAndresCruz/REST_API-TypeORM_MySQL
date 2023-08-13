import { NextFunction, Request, Response } from "express";
import { User } from "../../database/entities/User";
import { Roles } from "../../constants/Role";
import { ResponseUtl } from "../../utils/Response";
import { verify } from "jsonwebtoken";
import { AppDataSource } from "../../database/data-source";

export class AdminMiddleware {
  static async check(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies["accessToken"];

      const payload: any = verify(accessToken, "access_secret");

      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          id: payload.userId,
        },
      });
      console.log(user);

      const userAdmin = user as User;
      console.log(userAdmin);

      if (userAdmin.role !== Roles.ADMIN) {
        return ResponseUtl.sendError(
          res,
          "Insufficient permissions",
          401,
          null
        );
      }
    } catch (error) {
      return ResponseUtl.sendError(res, (error as Error).message, 401, null);
    }
    next();
  }
}
