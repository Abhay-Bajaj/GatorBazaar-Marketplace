const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/checkLoggedUser", authController.checkLoggedUser);
router.put("/changePassword", authController.changePassword)

module.exports = router;