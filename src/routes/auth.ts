import express from "express";
import { AuthController } from "../http/controllers/AuthController";

const authController = new AuthController();

const router = express.Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/user", authController.authenticatedUser);
router.post("/refresh", authController.refresh);
router.get("/refresh", authController.logout);

export default router;
