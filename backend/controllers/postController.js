const { Post, Category, PostCategory } = require("../models/models");
const ApiError = require("../error/ApiError");
const { getAllPosts } = require("./categoryController");

class PostController {
    async create(req, res, next) {
        try {
            const { title, content, categories } = req.body;

            if (!title || !content || !categories)
                return next(ApiError.badRequest("Incorrect data!"));

            let post = await Post.create({ title, content });
            const db_categories = await Category.findAll({
                where: { id: categories },
            });
            const post_category = await post.addCategory(db_categories);

            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let { limit, page } = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            const post = await Post.findAndCountAll({
                limit,
                offset,
                include: { model: Category },
            });

            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            let { id } = req.params;
            const post = await Post.findOne({
                where: { id },
                include: { model: Category },
            });
            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOneCategories(req, res, next) {
        try {
            let { id } = req.params;
            const post = await Post.findOne({
                where: { id },
                include: { model: Category },
            });
            return res.json(post.categories);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async patch(req, res, next) {
        try {
            let { id } = req.params;
            const { title } = req.body;
            let description;

            if (req.body.description) description = req.body.description;

            if (!title) return next(ApiError.badRequest("Incorrect data!"));
            const category = await Category.update(
                { title, description },
                { where: { id } }
            );
            if (!category)
                return next(ApiError.badRequest("Category not found"));
            return res.json({ message: "complete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            let { id } = req.params;
            const post = await Post.destroy({ where: { id } });
            if (!post) return next(ApiError.badRequest("Post not found"));
            return res.json({ message: "Post delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new PostController();
