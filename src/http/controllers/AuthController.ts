import { NextFunction, Request, Response } from "express";
import { LoginDTO, RegisterDTO } from "../dtos/AuthDTO";
import { validateOrReject } from "class-validator";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";
import { ResponseUtl } from "../../utils/Response";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
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

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { email, password } = req.body;
      const dto = new LoginDTO();
      Object.assign(dto, req.body);

      await validateOrReject(dto);

      const repo = AppDataSource.getRepository(User);
      const user = await repo.findOneBy({ email });
      if (!user) {
        return ResponseUtl.sendError(res, "Invalid email", 401, null);
      }

      let passwordMatches = await compare(password, user.password);
      if (!passwordMatches) {
        return ResponseUtl.sendError(res, "Invalid password", 401, null);
      }

      let accessToken = sign({ userId: user.id }, "accessKey", {
        expiresIn: "30m",
      });

      const returnUser = user.toResponse(user);

      return ResponseUtl.sendResponse(
        res,
        "Login successfully",
        { returnUser, accessToken },
        null
      );
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to login", 404, error);
    }
  }
}
