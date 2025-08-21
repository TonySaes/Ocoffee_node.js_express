import express from "express";
import adminController from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/", adminController.index);
router.post("/create", adminController.create);

export default router;
