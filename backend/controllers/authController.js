const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const { User } = require("../models/models");
const tokenService = require("../service/tokenService");
const mailService = require("../service/mailService");

class AuthController {
    async register(req, res, next) {
        const { login, email, password, conf_password, role } = req.body;
        if (!login || !email || !conf_password || !password || password !== conf_password)
            return next(ApiError.badRequest("Data incorrect"));
        let candidate = await User.findOne({ where: { login } });
        if (candidate)
            return next(ApiError.badRequest("Login already in use!"));
        candidate = await User.findOne({ where: { email } });
        if (candidate)
            return next(ApiError.badRequest("Email already in use!"));

        const hashPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            login,
            email,
            role,
            password: hashPassword,
        });
        return res.json({ message: "Register complete" });
    }

    async login(req, res, next) {
        const { login, email, password } = req.body;
        if (!login || !email || !password)
            return next(ApiError.badRequest("Data incorrect"));

        const user = await User.findOne({ where: { login, email } });
        if (!user) return next(ApiError.notFound("User is not found"));

        if (!bcrypt.compareSync(password, user.password))
            return next(ApiError.badRequest("Invalid password!"));

        const token = tokenService.generateJWT(user.id, user.login, user.role);
        if (!user.confirm) {
            mailService.sendActivationMail(email, token);
            return next(ApiError.badRequest("Confirm email!"));
        }
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        }); //24h
        return res.json({ token });
    }

    async logout(req, res, next) {
        try {
            res.clearCookie("token");
            return res.json({ message: "Success" });
        } catch (e) {
            next(e);
        }
    }

    async emailConfirm(req, res, next) {
        const { token } = req.params;

        const { id } = tokenService.validateJWT(token);
        const user = await User.update({ confirm: true }, { where: { id } });
        if (!user) return next(ApiError.badRequest("Email not confirm"));

        return res.json({ message: "Account verified!" });
    }

    async resetPasswordLink(req, res, next) {
        const { email } = req.body;
        if (!email) return next(ApiError.badRequest("Incorrect data"));

        const user = await User.findOne({ where: { email } });
        if (!user) return next(ApiError.notFound("User is not found"));

        const token = tokenService.generateJWT(user.id, user.login, user.role);

        mailService.sendResetPass(email, token);

        return res.json({ message: "Check email" });
    }

    async resetPassword(req, res, next) {
        const { token } = req.params;
        const { password } = req.body;
        if (!token || !password)
            return next(ApiError.badRequest("Incorrect data"));

        const hashPassword = await bcrypt.hash(password, 12);

        const { id } = tokenService.validateJWT(token);
        const user = await User.update(
            { password: hashPassword },
            { where: { id } }
        );
        if (!user) return next(ApiError.badRequest("Password not reset!"));

        return res.json({ message: "Password reset!" });
    }

    async check(req, res, next) {
        const token = tokenService.generateJWT(
            req.user.id,
            req.user.login,
            req.user.role
        );
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        }); //24h
        return res.json({ token });
    }
}

module.exports = new AuthController();
