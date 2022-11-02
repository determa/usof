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
        const tokenAccess = tokenService.generateAccess(
            user.id,
            user.login,
            user.role
        );
        if (!user.confirm) {
            mailService.sendActivationMail(email, tokenAccess);
            return next(ApiError.badRequest("Confirm email!"));
        }
        res.cookie("token", tokenAccess, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }); //24h
        return res.json({ token, id: user.id, role: user.role });
    }

    async logout(req, res, next) {
        try {
            console.log(JSON.stringify(req.cookies));
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            });
            return res.json({ message: "Success" });
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }

    async emailConfirm(req, res, next) {
        const { token } = req.params;

        const ts = tokenService.validateJWT(token);
        console.log(ts);
        if (!ts) return next(ApiError.forbidden("Token is not correct"));

        const user = await User.update(
            { confirm: true },
            { where: { id: ts.id } }
        );
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

        const ts = tokenService.validateJWT(token);
        if (!ts) return next(ApiError.forbidden("Token is not correct"));
        const user = await User.update(
            { password: hashPassword },
            { where: { id: ts.id } }
        );
        if (!user) return next(ApiError.badRequest("Password not reset!"));

        return res.json({ message: "Password reset!" });
    }

    async check(req, res, next) {
        const token = tokenService.generateAccess(
            req.user.id,
            req.user.login,
            req.user.role
        );
        return res.json({ token, id: req.user.id, role: req.user.role });
    }
}

module.exports = new AuthController();
