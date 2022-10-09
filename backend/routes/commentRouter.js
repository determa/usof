const Router = require("express");
const commentController = require("../controllers/commentController");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.get("/:id", commentController.getOne);
router.get("/:id/like", authMiddleware, commentController.getAllLikes);
router.post("/:id/like", authMiddleware, commentController.addLike);
router.patch("/:id", commentController.patch);
router.delete("/:id", commentController.delete);
router.delete("/:id/like", authMiddleware, commentController.deleteLike);

module.exports = router;
