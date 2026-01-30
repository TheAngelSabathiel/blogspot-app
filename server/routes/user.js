const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");
const express = require("express");
const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getUserDetails);

router.put("/update", verify, userController.updateUserInfo);

router.patch("/change-pic", verify, userController.changeProfilePic);

module.exports = router;