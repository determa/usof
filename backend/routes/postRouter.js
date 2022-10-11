const Router = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();

router.get("/", postController.getAll);
router.get("/:id", postController.getOne);
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
