const { Post, Category, Comment, PostLike } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op, literal } = require("sequelize");
const ratingService = require("../service/ratingService");

class PostController {
    async create(req, res, next) {
        try {
            let { title, content, categories } = req.body;

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
            if (!db_categories[0])
                return next(ApiError.notFound("Category not found!"));
            const post_category = await post.addCategory(db_categories);

            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let { limit, page, categories, startDate, endDate, status, sort } =
                req.query;

            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            let catObj = { where: {} };
            let postObj = {};
            if (status) postObj = { status };
            if (req.user) {
                //права доступа + status
                if (req.user.role == "USER") {
                    if (status == undefined) {
                        postObj = {
                            [Op.or]: [
                                { userId: req.user.id },
                                { status: true },
                            ],
                        };
                    }
                    if (status == false)
                        postObj = { userId: req.user.id, status };
                }
            } else {
                postObj = { status: true };
            }

            if (categories) catObj.where.id = categories.split(",");

            if (startDate) startDate = new Date(startDate);
            if (endDate)
                endDate = new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1; //до конца дня

            if (startDate && endDate)
                postObj.createdAt = { [Op.gte]: startDate, [Op.lte]: endDate };
            if (!startDate && endDate)
                postObj.createdAt = { [Op.lte]: endDate };
            if (startDate && !endDate)
                postObj.createdAt = { [Op.gte]: startDate };

            let sortArr = [[literal("countlike"), "DESC"]];
            if (sort === "-like") sortArr = [[literal("countlike"), "ASC"]];
            if (sort === "date") sortArr = [['"createdAt"', "DESC"]];
            if (sort === "-date") sortArr = [['"createdAt"', "ASC"]];
            if (sort === "status") sortArr = [['"status"', "DESC"]];
            if (sort === "-status") sortArr = [['"status"', "ASC"]];

            const post = await Post.findAndCountAll({
                limit,
                offset,
                where: postObj,
                include: [{ model: Category, catObj }],
                attributes: {
                    include: [
                        [
                            literal(
                                `(SELECT COUNT(*) FROM post_likes WHERE "postId" = post.id AND type = 'LIKE')`
                            ),
                            "countlike",
                        ],
                        [
                            literal(
                                `(SELECT COUNT(*) FROM post_likes WHERE "postId" = post.id AND type = 'DISLIKE')`
                            ),
                            "countdislike",
                        ],
                    ],
                },
                order: sortArr,
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
            if (post.status == false) {
                if (req.user.id != post.userId && req.user.role != "ADMIN") {
                    return next(ApiError.forbidden());
                }
            }
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
            if (!post) return next(ApiError.notFound("Post not found"));
            return res.json(post.categories);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async patch(req, res, next) {
        try {
            let { id } = req.params;
            let { content, categories, status } = req.body;
            categories = categories || 1;

            const post = await Post.findOne({ where: { id } });
            if (!post) return next(ApiError.notFound("Post not found!"));

            if (req.user.id != post.userId && req.user.role != "ADMIN") {
                return next(ApiError.forbidden());
            }

            let data = {};
            if (content && req.user.id == post.userId) data.content = content;
            if (status != undefined && req.user.role == "ADMIN")
                data.status = status;

            if (!data.content && !data.status)
                return next(ApiError.forbidden());
            await Post.update(data, { where: { id } });

            const db_categories = await Category.findAll({
                where: { id: categories },
            });
            if (!db_categories[0])
                return next(ApiError.notFound("Category not found!"));
            await post.setCategories(db_categories);

            return res.json({ message: "Post update!" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            let { id } = req.params;

            const post = await Post.findOne({ where: { id } });
            if (!post) return next(ApiError.notFound("Post not found!"));

            if (req.user.id != post.userId && req.user.role != "ADMIN") {
                return next(ApiError.forbidden());
            }

            const delPost = await Post.destroy({ where: { id } });
            if (!delPost) return next(ApiError.notFound("Post not found"));
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
            if (!post[0]) return next(ApiError.notFound("Post not found"));
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

            const post = await Post.findOne({ where: { id } });
            if (!post) return next(ApiError.notFound("Post not found"));
            let comment = await Comment.create({
                content,
                userId: req.user.id,
                postId: id,
            });
            if (!comment) return next(ApiError.badRequest("comment not add"));
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
            if (!post) return next(ApiError.notFound("Post not found"));

            let like = await PostLike.findOne({
                where: { userId: req.user.id, postId: id },
            });
            if (!like) {
                let result = await PostLike.create({
                    type,
                    postId: id,
                    userId: req.user.id,
                });
                await ratingService(type, post.userId);
                return res.json(result);
            }
            if (like.type != type) {
                let result = await PostLike.update(
                    { type },
                    { where: { userId: req.user.id, postId: id } }
                );
                if (!result[0])
                    return next(ApiError.badRequest("Like not update"));
                await ratingService(type, post.userId, 2);
            }
            return res.json({ message: "Like changed" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllLikes(req, res, next) {
        try {
            const { id } = req.params;
            let post = await Post.findOne({ where: { id } });
            if (!post) return next(ApiError.notFound("Post not found"));

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
            const post = await Post.findOne({ where: { id: id } });
            const like = await PostLike.findOne({
                where: { userId: req.user.id, postId: id },
            });
            const delLike = await PostLike.destroy({
                where: { userId: req.user.id, postId: id },
            });
            if (!delLike) return next(ApiError.notFound("Like not found"));

            await ratingService(like.type, post.userId, -1);
            return res.json({ message: "Like delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new PostController();
