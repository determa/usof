const Router = require("express");
const categoryController = require("../controllers/categoryController");
const router = new Router();
const checkRole = require("../middleware/checkRoleMiddleware");

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);
router.get("/:id/posts", categoryController.getAllPosts);
router.post("/", checkRole("ADMIN"), categoryController.create);
router.patch("/:id", checkRole("ADMIN"), categoryController.patch);
router.delete("/:id", checkRole("ADMIN"), categoryController.delete);

module.exports = router;
