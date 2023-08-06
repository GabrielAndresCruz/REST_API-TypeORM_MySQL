import express from "express";
import { FileUploader } from "../http/middlewares/FileUploader";
import { BooksController } from "../http/controllers/BooksController";

const router = express.Router();

const booksControler = new BooksController();

router.get("/", booksControler.get);

router.get("/:id", booksControler.getBook);

router.post(
  "/",
  FileUploader.upload("image", "authors", 2 * 1024 * 1024),
  booksControler.create
);

router.put("/:id", booksControler.update);

router.delete("/:id", booksControler.delete);

export default router;
