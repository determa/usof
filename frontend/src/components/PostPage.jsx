import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../services/ApiService";
import getFormattedDate from "../services/getFormatDate";
import Comments from "./Comment";
import CommentCreate from "./CommentCreate";
import "./Styles/Post.css";
import UserInfo from "./UserInfo";

const PostPage = () => {
    let { isAuth } = useSelector((state) => state.auth);

    const { id } = useParams();
    const { data: post } = API.useFetchOnePostQuery(id);
    const navigate = useNavigate();

    const [deletePost, { error: deleteError }] = API.useDeletePostMutation();
    const [updatePost, { error: updateError }] = API.useUpdatePostMutation();

    const handleRemove = async (e) => {
        e.stopPropagation();
        let res = await deletePost(post);
        if (res.data) navigate("posts");
    };

    const handleUpdate = async (e) => {
        let arr = [];
        post.categories.forEach((value) => {
            arr.push(value.id);
        });
        const content = prompt() || "";
        let res = await updatePost({
            id: id,
            content: content,
            categories: arr,
        });
    };

    return (
        <div className="block__own">
            {post && (
                <>
                    <div className="block fd_col">
                        {post && (
                            <div className="user__info">
                                <UserInfo userId={post.userId} />
                            </div>
                        )}
                        <span className="post-title">{post.title}</span>
                        <span className="categories">
                            {post.categories.map((category) => (
                                <span key={category.id} className="category">
                                    {category.title}
                                </span>
                            ))}
                        </span>
                        <div className="post__content">
                            <p>{post.content}</p>
                        </div>
                        <div className="df jc_sb">
                            <span className="date">
                                {getFormattedDate(post.createdAt)}
                            </span>
                            <span className="date">
                                status: {post.status ? "true" : "false"}
                            </span>
                        </div>
                        <span style={{ color: "red" }}>
                            {deleteError && deleteError.data.message}
                            {updateError && updateError.data.message}
                        </span>
                        {isAuth ? (
                            <div className="post__buttons">
                                <button onClick={handleRemove}>Delete</button>
                                <button onClick={handleUpdate}>Update</button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="comments">
                        <div className="block__own">
                            {isAuth ? (
                                <CommentCreate postId={post.id} />
                            ) : (
                                <></>
                            )}
                            <Comments postId={post.id} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PostPage;
