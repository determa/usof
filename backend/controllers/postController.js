const { Post, Category, Comment } = require("../models/models");
const ApiError = require("../error/ApiError");

class PostController {
    async create(req, res, next) {
        try {
            const { title, content, categories } = req.body;

            if (!title || !content || !categories)
                return next(ApiError.badRequest("Incorrect data!"));

            let post = await Post.create({
                title,
                content,
                userId: req.user.id,
            });
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
            const { title, content, categories } = req.body;

            await Post.update({ title, content }, { where: { id } });
            const post = await Post.findOne({ where: { id } });
            if (req.user.id !== post.userId)
                return next(ApiError.forbidden("Access is denied"));
            const db_categories = await Category.findAll({
                where: { id: categories },
            });
            const post_category = await post.setCategories(db_categories);
            return res.json(post);
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

    async getAllComment(req, res, next) {
        try {
            let { id } = req.params;
            let { limit, page } = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            const post = await Post.findAll({
                limit,
                offset,
                include: { model: Comment },
                where: { id },
            });
            return res.json(post[0].comments);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async createComment(req, res, next) {
        try {
            let { id } = req.params;
            const { content } = req.body;
            if (!content) return next(ApiError.badRequest("Content is null"));

            let comment = await Comment.create({
                content,
                userId: req.user.id,
                postId: id,
            });

            return res.json(comment);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new PostController();
