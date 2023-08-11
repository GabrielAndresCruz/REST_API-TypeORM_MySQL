import express from "express";
import { AuthController } from "../http/controllers/AuthController";

const authController = new AuthController();

const router = express.Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

export default router;
