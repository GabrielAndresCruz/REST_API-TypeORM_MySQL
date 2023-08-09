import { NextFunction, Request, Response } from "express";
import { RegisterDTO } from "../dtos/AuthDTO";
import { validateOrReject } from "class-validator";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";
import { ResponseUtl } from "../../utils/Response";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const registerData = req.body;
      const dto = new RegisterDTO();
      Object.assign(dto, registerData);

      await validateOrReject(dto);

      const repo = AppDataSource.getRepository(User);
      const user = repo.create(registerData);
      await repo.save(user);

      return ResponseUtl.sendResponse<User>(
        res,
        "User created successfully",
        user[0],
        null
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to create user", 404, error);
    }
  }
}
