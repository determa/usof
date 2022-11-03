import React from "react";
import { API } from "../services/ApiService";

export const PostLikes = ({ post }) => {
    const { data } = API.useGetPostLikesQuery(post.id);

    const [addLike] = API.useAddPostLikeMutation();

    return (
        <>{data && <LikeBlock data={data} id={post.id} addLike={addLike} />}</>
    );
};

export const CommentLikes = ({ comment }) => {
    const { data } = API.useGetCommentLikesQuery(comment.id);

    const [addLike] = API.useAddCommentLikeMutation();

    return (
        <>
            {data && (
                <LikeBlock data={data} id={comment.id} addLike={addLike} />
            )}
        </>
    );
};

const LikeBlock = ({ data, id, addLike }) => {
    const isLike = (value) => {
        return value.type === "LIKE";
    };
    const isDisLike = (value) => {
        return value.type === "DISLIKE";
    };

    const addLikeHandler = async (e) => {
        e.preventDefault();
        await addLike({ id: id, type: "LIKE" });
    };
    const addDisLikeHandler = async (e) => {
        e.preventDefault();
        await addLike({ id: id, type: "DISLIKE" });
    };

    return (
        <>
            <span className="like_item" onClick={addLikeHandler}>
                <span>{data.filter(isLike).length} </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-thumb-up"
                    width="24"
                    height="24"
                    viewBox="0 0 22 25"
                    strokeWidth={"1.5"}
                    stroke="#000000"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
                </svg>
            </span>
            <span className="like_item" onClick={addDisLikeHandler}>
                <span>{data.filter(isDisLike).length} </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-thumb-down"
                    width="24"
                    height="24"
                    viewBox="0 0 22 25"
                    strokeWidth={"1.5"}
                    stroke="#000000"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
                </svg>
            </span>
        </>
    );
};
