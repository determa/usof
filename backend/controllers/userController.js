const ApiError = require("../error/ApiError");
const { User } = require("../models/models");
const uuid = require("uuid");
const path = require("path");

class UserController {
    async getAll(req, res) {
        try {
            let { limit, page } = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            const users = await User.findAndCountAll({ limit, offset });

            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            let { id } = req.params;
            const users = await User.findOne({ where: { id } });
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async patchAvatar(req, res, next) {
        try {
            let { img } = req.files;

            let fileName = uuid.v4() + ".jpg";
            const user = await User.findOne({ where: { id: req.user.id } });
            if (user.picture) {
                fileName = user.picture;
            } else {
                const avatar = await User.update(
                    { picture: fileName },
                    { where: { id: req.user.id } }
                );
                if (!avatar) return next(ApiError.notFound("User not found"));
            }
            img.mv(path.resolve(__dirname, "..", "static", fileName));
            return res.json({ message: "complete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async patchData(req, res, next) {
        try {
            let { id } = req.params;
            let { login, email, full_name, role } = req.body;
            if (!login || !email || !full_name)
                return next(ApiError.badRequest("Incorrect data!"));
            const user = await User.update(
                { login, email, full_name, role },
                { where: { id } }
            );
            if (!user) return next(ApiError.notFound("User not found"));
            return res.json({ message: "complete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            let { id } = req.params;
            const user = await User.destroy({ where: { id } });
            if (!user) return next(ApiError.notFound("User not found"));
            return res.json({ message: "User delete" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new UserController();
