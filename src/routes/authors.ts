import express from "express";
import { AuthorsController } from "../controllers/AuthorsController";

const router = express.Router();

const authorsController = new AuthorsController();

router.get("/", authorsController.getAuthors);

export default router;
