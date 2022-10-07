const Router = require("express");
const commentController = require("../controllers/commentController");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.get("/:id", commentController.getOne);
router.patch("/:id", commentController.patch);
router.delete("/:id", commentController.delete);

module.exports = router;
