const { Comment, Post } = require("../models/models");
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
}

module.exports = new CommentController();
