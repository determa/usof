const { Comment, CommentLike } = require("../models/models");
const ApiError = require("../error/ApiError");
const ratingService = require("../service/ratingService");

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
            const { status } = req.body;
            if (!status) return next(ApiError.badRequest("Status is null"));

            const comment = await Comment.findOne({ where: { id } });
            if (!comment) return next(ApiError.notFound("Comment not found!"));

            if (req.user.id != comment.userId && req.user.role != "ADMIN") {
                return next(ApiError.forbidden());
            }

            const upd = await Comment.update({ status }, { where: { id } });
            if (!upd[0]) return next(ApiError.notFound("Comment not update"));
            return res.json({ message: "complete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            let { id } = req.params;

            const comment = await Comment.findOne({ where: { id } });
            if (!comment) return next(ApiError.notFound("Comment not found!"));

            if (req.user.id != comment.userId && req.user.role != "ADMIN") {
                return next(ApiError.forbidden());
            }

            const commentDel = await Comment.destroy({ where: { id } });
            if (!commentDel)
                return next(ApiError.notFound("Comment not found"));
            return res.json({ message: "Comment delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async addLike(req, res, next) {
        try {
            const { id } = req.params;
            const { type } = req.body;
            let comment = await Comment.findOne({ where: { id } });
            if (!comment) return next(ApiError.notFound("Comment not found"));

            let like = await CommentLike.findOne({
                where: { userId: req.user.id, commentId: id },
            });
            if (!like) {
                let result = await CommentLike.create({
                    type,
                    commentId: id,
                    userId: req.user.id,
                });
                await ratingService(type, comment.userId);
                return res.json(result);
            }
            if (like.type != type) {
                let result = await CommentLike.update(
                    { type },
                    { where: { userId: req.user.id, commentId: id } }
                );
                if (!result[0])
                    return next(ApiError.badRequest("Like not update"));
                await ratingService(type, comment.userId, 2);
            }
            return res.json({ message: "Like changed" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllLikes(req, res, next) {
        try {
            const { id } = req.params;
            let comment = await Comment.findOne({ where: { id } });
            if (!comment) return next(ApiError.notFound("Comment not found"));

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
            const comment = await Comment.findOne({ where: { id: id } });
            const like = await CommentLike.findOne({
                where: { userId: req.user.id, commentId: id },
            });
            const delLike = await CommentLike.destroy({
                where: { userId: req.user.id, commentId: id },
            });
            if (!delLike)
                return next(ApiError.notFound("Comment or like not found"));
            await ratingService(like.type, comment.userId, -1);
            return res.json({ message: "Like delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new CommentController();
