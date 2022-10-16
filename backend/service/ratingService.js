const { User } = require("../models/models");
module.exports = async function changeRating(type, userId, count = 1) {
    if (!userId || !type) return null;
    try {
        let res = null;
        if (type == "LIKE") {
            res = await User.increment(
                { rating: count },
                { where: { id: userId } }
            );
        }
        if (type == "DISLIKE") {
            res = await User.decrement(
                { rating: count },
                { where: { id: userId } }
            );
        }
        return res;
    } catch (e) {
        return null;
    }
};
