import express from "express";

import adminController from "../controllers/admin.controller.js";

import adminChecker from "../modules/adminChecker.js"
import upload from "../modules/multerForAddCoffee.js";



const router = express.Router();

router.get("/", adminController.index);
router.post("/coffees/:id/delete", adminChecker, adminController.deleteCoffee);
router.get("/createCoffee", adminController.showCreateCoffee);
router.post("/createCoffee", upload.single("uploaded_file"), adminController.createCoffee);
router.get("/createTaste", adminController.showCreateTaste);
router.post("/createTaste", adminController.createTaste);
router.get("/createUser", adminController.showCreateUser);
router.post("/createUser", adminController.createUser);
router.get("/editCoffee/:id", adminController.showEditCoffee);
router.post("/editCoffee/:id", adminController.editCoffee);
router.get("/editUser/:id", adminController.showEditUser);
router.post("/editUser/:id", adminController.editUser);
router.get("/login", adminController.showLogin);
router.post("/login", adminController.handleLogin);
router.get("/logout", adminController.handleLogout);
router.get("/manageUsers", adminController.listUsers);

export default router;
