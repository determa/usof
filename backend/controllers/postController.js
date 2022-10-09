const { Post, Category, Comment, PostLike } = require("../models/models");
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

    async addLike(req, res, next) {
        try {
            const { id } = req.params;
            const { type } = req.body;
            let post = await Post.findOne({ where: { id } });
            if (!post) return next(ApiError.badRequest("Post not found"));

            let like = await PostLike.findOne({
                where: { userId: req.user.id, postId: id },
            });
            if (!like) {
                let result = await PostLike.create({
                    type,
                    postId: id,
                    userId: req.user.id,
                });
                return res.json(result);
            }
            let result = await PostLike.update(
                { type },
                { where: { userId: req.user.id, postId: id } }
            );
            if (!result[0]) return next(ApiError.badRequest("Like not update"));
            return res.json({ message: "Like changed" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllLikes(req, res, next) {
        try {
            const { id } = req.params;
            let post = await Post.findOne({ where: { id } });
            if (!post) return next(ApiError.badRequest("Post not found"));

            const like = await Post.findAll({
                where: { id },
                include: { model: PostLike },
            });
            return res.json(like[0].post_likes);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteLike(req, res, next) {
        try {
            const { id } = req.params;
            const like = await PostLike.destroy({
                where: { userId: req.user.id, postId: id },
            });
            if (!like) return next(ApiError.badRequest("Like not found"));
            return res.json({ message: "Like delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new PostController();
