import express from "express";

import shopController from "../controllers/shop.controller.js";

const router = express.Router();

router.get("/", shopController.index);

export default router;
