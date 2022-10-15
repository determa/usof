const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        req.user = { role: "GUEST" };
        return next();
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            req.user = { role: "GUEST" };
            return next();
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        return next();
    } catch (e) {
        req.user = { role: "GUEST" };
        return next();
    }
};
