import { NextFunction, Request, Response } from "express";
import { User } from "../../database/entities/User";
import { Roles } from "../../constants/Role";
import { ResponseUtl } from "../../utils/Response";
import { verify } from "jsonwebtoken";
import { AppDataSource } from "../../database/data-source";

export class AdminMiddleware {
  static async check(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies["accessToken"];

    const payload: any = verify(accessToken, "access_secret");

    if (!payload) {
      return res.status(401).send({
        message: "Unauthenticated",
      });
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        id: payload.id,
      },
    });

    const userAdmin = user as User;
    if (userAdmin.role !== Roles.ADMIN) {
      return ResponseUtl.sendError(res, "Insufficient permissions", 401, null);
    }
  }
}
