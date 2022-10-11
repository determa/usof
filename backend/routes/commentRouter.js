const Router = require("express");
const commentController = require("../controllers/commentController");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.get("/:id", commentController.getOne);
router.get("/:id/like", commentController.getAllLikes);
router.post("/:id/like", authMiddleware, commentController.addLike);
router.patch("/:id", authMiddleware, commentController.patch);
router.delete("/:id", authMiddleware, commentController.delete);
router.delete("/:id/like", authMiddleware, commentController.deleteLike);

module.exports = router;
