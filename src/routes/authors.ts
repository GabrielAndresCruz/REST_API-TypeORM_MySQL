import express from "express";
import { AuthorsController } from "../controllers/AuthorsController";
import { FileUploader } from "../middlewares/FileUploader";

const router = express.Router();

const authorsController = new AuthorsController();

router.get("/", authorsController.getAuthors);

router.get("/:id", authorsController.getAuthor);

router.post(
  "/",
  FileUploader.upload("image", "authors", 2 * 1024 * 1024),
  authorsController.create
);

router.put("/:id", authorsController.update);

router.delete("/:id", authorsController.delete);

export default router;
