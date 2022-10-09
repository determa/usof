const { Comment, CommentLike } = require("../models/models");
const ApiError = require("../error/ApiError");

class CommentController {
    async getOne(req, res, next) {
        try {
            let { id } = req.params;
            const comment = await Comment.findOne({ where: { id } });
            return res.json(comment);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async patch(req, res, next) {
        try {
            let { id } = req.params;
            const { content } = req.body;
            if (!content) return next(ApiError.badRequest("Content is null"));

            const comment = await Comment.update(
                { content },
                { where: { id } }
            );
            if (!comment)
                return next(ApiError.badRequest("Category not found"));
            return res.json({ message: "complete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            let { id } = req.params;
            const comment = await Comment.destroy({ where: { id } });
            if (!comment)
                return next(ApiError.badRequest("Category not found"));
            return res.json({ message: "Category delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async addLike(req, res, next) {
        try {
            const { id } = req.params;
            const { type } = req.body;
            let comment = await Comment.findOne({ where: { id } });
            if (!comment) return next(ApiError.badRequest("Comment not found"));

            let like = await CommentLike.findOne({
                where: { userId: req.user.id, commentId: id },
            });
            if (!like) {
                let result = await CommentLike.create({
                    type,
                    commentId: id,
                    userId: req.user.id,
                });
                return res.json(result);
            }
            let result = await CommentLike.update(
                { type },
                { where: { userId: req.user.id, commentId: id } }
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
            let comment = await Comment.findOne({ where: { id } });
            if (!comment) return next(ApiError.badRequest("Comment not found"));

            const like = await Comment.findAll({
                where: { id },
                include: { model: CommentLike },
            });
            return res.json(like[0].comment_likes);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteLike(req, res, next) {
        try {
            const { id } = req.params;
            const like = await CommentLike.destroy({
                where: { userId: req.user.id, commentId: id },
            });
            if (!like) return next(ApiError.badRequest("Like not found"));
            return res.json({ message: "Like delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new CommentController();
