const Router = require("express");
const router = new Router();
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/password-reset", AuthController.resetPasswordLink);
router.post("/password-reset/:token", AuthController.resetPassword);
router.post("/email-confirm/:token", AuthController.emailConfirm);
router.get("/refresh", authMiddleware, AuthController.check);

module.exports = router;
