const Router = require("express");
const postController = require("../controllers/postController");
const router = new Router();

router.get("/", postController.getAll);
router.get("/:id", postController.getOne);
router.get("/:id/categories", postController.getOneCategories);
router.post("/", postController.create);
router.delete("/:id", postController.delete);

module.exports = router;
