const Router = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();

router.get("/", postController.getAll);
router.get("/:id", postController.getOne);
router.get("/:id/categories", postController.getOneCategories);
router.post("/", authMiddleware, postController.create);
router.patch("/:id", authMiddleware, postController.patch);
router.delete("/:id", authMiddleware, postController.delete);

module.exports = router;
