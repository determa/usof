import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API } from "../services/ApiService";
import PostItem from "./PostItem";
import "./Styles/Post.css";

const PostContainer = () => {
    let { isAuth } = useSelector((state) => state.auth);
    const { data: posts, isLoading, error } = API.useFetchAllPostsQuery(100);

    return (
        <>
            {isAuth ? (
                <div className="post__create">
                    <Link to="/posts/create" className="link">
                        <p>Add new post</p>
                    </Link>
                </div>
            ) : (
                <></>
            )}
            <div className="block__own">
                {isLoading && <h1>Loading...</h1>}
                {error && <h1>{error.data.message}</h1>}
                {posts &&
                    posts.rows.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
            </div>
        </>
    );
};

export default PostContainer;
