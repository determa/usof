const sequelize = require("../db");

const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    full_name: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false },
    picture: { type: DataTypes.STRING },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    confirm: { type: DataTypes.BOOLEAN, defaultValue: false },
    role: { type: DataTypes.ENUM("USER", "ADMIN"), defaultValue: "USER" },
});

const Post = sequelize.define("post", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    publish_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    content: { type: DataTypes.TEXT, allowNull: false },
});

const Category = sequelize.define("category", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false, defaultValue: "-" },
});

const Comment = sequelize.define("comment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    publish_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    content: { type: DataTypes.STRING, allowNull: false },
});

const PostLike = sequelize.define("post_like", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    publish_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    type: { type: DataTypes.ENUM("LIKE", "DISLIKE") },
});

const CommentLike = sequelize.define("comment_like", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    publish_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    type: { type: DataTypes.ENUM("LIKE", "DISLIKE") },
});

const PostCategory = sequelize.define("post_category", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// user
User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(PostLike);
PostLike.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

User.hasMany(CommentLike);
CommentLike.belongsTo(User);

// post
Post.hasMany(PostLike);
PostLike.belongsTo(Post);

Post.hasMany(Comment);
Comment.belongsTo(Post);

// comment
Comment.hasMany(CommentLike);
CommentLike.belongsTo(Comment);

// PostCategory
Post.belongsToMany(Category, { through: PostCategory });
Category.belongsToMany(Post, { through: PostCategory });

module.exports = {
    User,
    Post,
    Category,
    Comment,
    PostLike,
    CommentLike,
    PostCategory,
};
