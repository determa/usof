import React from "react";
import { API } from "../services/ApiService";

const Likes = ({ post }) => {
    const { data } = API.useGetPostLikesQuery(post.id);
    const isLike = (value) => {
        return value.type === "LIKE";
    };
    const isDisLike = (value) => {
        return value.type === "DISLIKE";
    };

    const [addLike, { error: addError }] = API.useAddPostLikeMutation();
    const [deleteLike, { error: deleteError }] =
        API.useDeletePostLikeMutation();

    const addLikeHandler = async (e) => {
        e.preventDefault();
        await addLike({ id: post.id, type: "LIKE" });
    };
    const addDisLikeHandler = async (e) => {
        e.preventDefault();
        await addLike({ id: post.id, type: "DISLIKE" });
    };
    // console.log(data);

    // const like_handler = async (e) => {
    //     e.preventDefault();

    //     await addLike({ id: post.id });
    // };

    const handleRemove = async (e) => {
        e.stopPropagation();
        let res = await deleteLike(data);
    };

    return (
        <>
            <span className="like_item" onClick={addLikeHandler}>
                &#10004;
            </span>
            <span>
                {data &&
                    data.filter(isLike).length - data.filter(isDisLike).length}
            </span>
            <span className="like_item" onClick={addDisLikeHandler}>
                &#10006;
            </span>
        </>
    );
};

export default Likes;
