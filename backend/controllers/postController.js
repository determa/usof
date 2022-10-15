const { Post, Category, Comment, PostLike } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op, literal } = require("sequelize");

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
            // if (req.user.role == "GUEST") {
            //     if (status == false) {
            //         console.log("111_", req.user.role);
            //         return res.json({});
            //     } else {
            //         console.log("111", req.user.role);
            //         postObj = { status: true };
            //     }
            // }
            // if (req.user.role == "USER") {
            //     if (status == false) {
            //         // status: status,
            //         console.log("222_", req.user.role);
            //         postObj = { userId: req.user.id, status: false };
            //     } else {
            //         console.log("222", req.user.role);
            //         postObj = {
            //             status: status,
            //             include: {
            //                 [Op.and]: [
            //                     { userId: req.user.id },
            //                     { status: false },
            //                 ],
            //             },
            //         };
            //     }
            // }
            // if (req.user.role == "ADMIN") {
            //     if (status == true) {
            //         console.log("333", req.user.role);
            //         postObj = {
            //             [Op.and]: [
            //                 { userId: req.user.id, status: false },
            //                 { status: status },
            //             ],
            //         };
            //     } else {
            //         console.log("333_", req.user.role);
            //         postObj = { status };
            //     }
            // }

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
            const { title, content, categories, status } = req.body;

            await Post.update({ title, content, status }, { where: { id } });
            const post = await Post.findOne({ where: { id } });
            if (req.user.id !== post.userId) return next(ApiError.forbidden());
            const db_categories = await Category.findAll({
                where: { id: categories },
            });
            if (!db_categories[0])
                return next(ApiError.notFound("Category not found!"));
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
            if (!post) return next(ApiError.notFound("Post not found"));
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
            const like = await PostLike.destroy({
                where: { userId: req.user.id, postId: id },
            });
            if (!like) return next(ApiError.notFound("Like not found"));
            return res.json({ message: "Like delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new PostController();
