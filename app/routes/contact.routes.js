import express from "express";

import contactController from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", contactController.index);
router.post("/", contactController.sendMessage);

export default router;