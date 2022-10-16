const Router = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const router = new Router();

router.get("/", checkRole, postController.getAll);
router.get("/:id", checkRole, postController.getOne);
router.get("/:id/categories", postController.getOneCategories);
router.get("/:id/comments", postController.getAllComment);
router.get("/:id/like", postController.getAllLikes);
router.post("/", authMiddleware, postController.create);
router.post("/:id/comments", authMiddleware, postController.createComment);
router.post("/:id/like", authMiddleware, postController.addLike);
router.patch("/:id", authMiddleware, postController.patch);
router.delete("/:id", authMiddleware, postController.delete);
router.delete("/:id/like", authMiddleware, postController.deleteLike);

module.exports = router;
