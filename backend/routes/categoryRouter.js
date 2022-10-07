const Router = require("express");
const categoryController = require("../controllers/categoryController");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);
router.get("/:id/posts", categoryController.getAllPosts);
router.post("/", categoryController.create);
router.patch("/:id", categoryController.patch);
router.delete("/:id", categoryController.delete);

module.exports = router;
