import express from "express";

import adminController from "../controllers/admin.controller.js";

import adminChecker from "../middlewares/adminChecker.js"
import upload from "../modules/multerForAddCoffee.js";



const router = express.Router();

router.get("/", adminController.index);
router.post("/coffees/:id/delete", adminChecker, adminController.deleteCoffee);
router.get("/createCoffee", adminChecker, adminController.showCreateCoffee);
router.post("/createCoffee", adminChecker, upload.single("uploaded_file"), adminController.createCoffee);
router.get("/createTaste", adminChecker, adminController.showCreateTaste);
router.post("/createTaste", adminChecker, adminController.createTaste);
router.get("/createUser", adminChecker, adminController.showCreateUser);
router.post("/createUser", adminChecker, adminController.createUser);
router.get("/editCoffee/:id", adminChecker, adminController.showEditCoffee);
router.post("/editCoffee/:id", adminChecker, adminController.editCoffee);
router.get("/editUser/:id", adminChecker, adminController.showEditUser);
router.post("/editUser/:id", adminChecker, adminController.editUser);
router.post("/users/:id/delete", adminChecker, adminController.deleteUser);
router.get("/login", adminController.showLogin);
router.post("/login", adminController.handleLogin);
router.get("/logout", adminController.handleLogout);
router.get("/manageUsers", adminChecker, adminController.listUsers);
router.get("/manageCoffees", adminChecker, adminController.listCoffees);

export default router;
