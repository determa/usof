const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");

module.exports = (role) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            const token = req.cookies.token;
            // const token = req.headers.authorization.split(' ')[1]; //bearer token
            if (!token) {
                return next(ApiError.notAuth());
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            if (decoded.role !== role) {
                return next(ApiError.forbidden());
            }
            req.user = decoded;
            next();
        } catch (e) {
            return next(ApiError.notAuth());
        }
    };
};
