import express from "express";
import { AuthorsController } from "../controllers/AuthorsController";

const router = express.Router();

const authorsController = new AuthorsController();

router.get("/", authorsController.getAuthors);

router.get("/:id", authorsController.getAuthor);

export default router;
