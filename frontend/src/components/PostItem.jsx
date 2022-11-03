import React from "react";
import { Link } from "react-router-dom";
import getFormattedDate from "../services/getFormatDate";
import { PostLikes } from "./Likes";
import UserInfo from "./UserInfo";

const PostItem = ({ post }) => {
    return (
        <div className="block jc_sb">
            <div className="post__fl_aic">
                <div className="user__info">
                    <UserInfo userId={post.userId} />
                </div>
                <div className="short_info">
                    <Link to={`/posts/${post.id}`}>
                        <h3 className="post-title">{post.title}</h3>
                    </Link>
                    <span className="categories">
                        Categories:{" "}
                        {post.categories.map(
                            (category) => " " + category.title
                        )}
                    </span>
                    <span>{getFormattedDate(post.createdAt)}</span>
                </div>
            </div>
            <div className="likes">
                <PostLikes post={post} />
            </div>
        </div>
    );
};

export default PostItem;
