import express from "express";
import adminController from "../controllers/admin.controller.js";
import upload from "../modules/multerForAddCoffee.js";



const router = express.Router();

router.get("/", adminController.index);
router.post("/", upload.single("uploaded_file"), adminController.createCoffee);

export default router;
