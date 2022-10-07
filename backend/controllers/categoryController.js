const { Category, Post } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");

class CategoryController {
    async create(req, res, next) {
        try {
            const { title } = req.body;
            let description;

            if (req.body.description) description = req.body.description;

            if (!title) return next(ApiError.badRequest("Incorrect data!"));

            const category = await Category.create({
                title,
                description,
            });
            return res.json(category);
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

            const category = await Category.findAndCountAll({ limit, offset });

            return res.json(category);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllPosts(req, res, next) {
        try {
            let { id } = req.params;
            let { limit, page } = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            const posts = await Post.findAll({
                limit,
                offset,
                include: {
                    model: Category,
                    where: { id },
                },
            });
            return res.json(posts);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            let { id } = req.params;
            const category = await Category.findOne({ where: { id } });
            return res.json(category);
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
            const category = await Category.destroy({ where: { id } });
            if (!category)
                return next(ApiError.badRequest("Category not found"));
            return res.json({ message: "Category delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new CategoryController();
