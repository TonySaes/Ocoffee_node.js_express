import express from "express";
import coffeeController from "../controllers/coffee.controller.js";

const router = express.Router();

router.get("/", coffeeController.list);
router.get("/:reference", coffeeController.detail);
export default router;
