const Router = require("express");
const router = new Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.post("/", checkRole("ADMIN"), authController.register);
router.patch("/avatar", authMiddleware, userController.patchAvatar);
router.patch("/:id", authMiddleware, userController.patchData);
router.delete("/:id", authMiddleware, userController.delete);

module.exports = router;
