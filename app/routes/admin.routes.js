import express from "express";
import adminController from "../controllers/admin.controller.js";
import upload from "../modules/multerForAddCoffee.js";



const router = express.Router();

router.get("/", adminController.index);
router.get("/login", adminController.showLogin);
router.post("/login", adminController.handleLogin);
router.get("/logout", adminController.logout);
router.get("/createCoffee", adminController.showCreateCoffee);
router.post("/createCoffee", upload.single("uploaded_file"), adminController.createCoffee);

export default router;
