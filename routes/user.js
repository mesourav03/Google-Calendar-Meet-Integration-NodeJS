const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

const requireAuth = require("../middlewares/requireAuth");

router.use(requireAuth);

router.get("/getAllUsers", UserController.getAllUsers.bind(UserController));
router.post("/addmyslot", UserController.addMySlot.bind(UserController));

module.exports = router;