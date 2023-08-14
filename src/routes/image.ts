import express from "express";
import { ImagesController } from "../http/controllers/ImagesController";

const router = express.Router();

const imagesController = new ImagesController();

router.get("/:type/:id", imagesController.get);

export default router;
