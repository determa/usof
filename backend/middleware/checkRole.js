const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        // const token = req.cookies.token;
        const token = req.headers.authorization.split(" ")[1]; //bearer token
        if (!token) return next();

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        return next();
    } catch (e) {
        return next();
    }
};
