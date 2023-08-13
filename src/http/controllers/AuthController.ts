import { NextFunction, Request, Response } from "express";
import { LoginDTO, RegisterDTO } from "../dtos/AuthDTO";
import { validateOrReject } from "class-validator";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";
import { ResponseUtl } from "../../utils/Response";
import { compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { getRepository } from "typeorm";

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
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

  async login(req: Request, res: Response) {
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

      let accessToken = sign({ userId: user.id }, "access_secret", {
        expiresIn: 60 * 60,
      });

      let refreshToken = sign({ userId: user.id }, "refresh_secret", {
        expiresIn: 60 * 60,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // equivalent to 1 day
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // equivalent to 7 day
      });

      return ResponseUtl.sendResponse(res, "Login successfully", user, null);
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to login", 404, error);
    }
  }

  async authenticatedUser(req: Request, res: Response) {
    try {
      const accessToken = req.cookies["accessToken"];

      const payload: any = verify(accessToken, "access_secret");

      if (!payload) {
        return res.status(401).send({
          message: "Unauthenticated",
        });
      }

      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          id: payload.userId,
        },
      });

      if (!user) {
        return res.status(401).send({
          message: "Unauthenticated",
        });
      }

      const { password, ...data } = user;

      return ResponseUtl.sendResponse(res, "User authenticated", data, null);
    } catch (error) {
      return res.status(401).send({
        message: "Unathenticated",
      });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies["refreshToken"];

      const payload: any = verify(refreshToken, "refresh_secret");

      if (!payload) {
        return res.status(401).send({
          message: "Unauthenticated",
        });
      }

      const accessToken = sign(
        {
          id: payload.id,
        },
        "access_secret",
        { expiresIn: 60 * 60 }
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //equivalent to 1 day
      });

      return ResponseUtl.sendResponse(res, "Successfully refresh", null, null);
    } catch (error) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      //Logic for corroborate the token login
      const refreshToken = req.cookies["accessToken"];

      if (!refreshToken) {
        return ResponseUtl.sendError(res, "No account logged", 404, null);
      }

      res.cookie("accessToken", "", { maxAge: 0 });
      res.cookie("refreshToken", "", { maxAge: 0 });

      return res.status(200).send({
        message: "Successfully sign out",
      });
    } catch (error) {
      return ResponseUtl.sendError(res, "Failed to logout", 404, error);
    }
  }
}
