import React from "react";
import { API } from "../services/ApiService";

function CommentCreate({ postId }) {
    const [createComment, { isSuccess, isError, error }] =
        API.useCreateCommentMutation();

    const create_handler = async (e) => {
        e.preventDefault();
        await createComment({ postId, content: new FormData(e.target) });
    };

    return (
        <div className="block">
            <form className="create_post_form" onSubmit={create_handler}>
                <textarea
                    name="content"
                    cols="30"
                    rows="10"
                    placeholder="Content"
                    required
                ></textarea>
                <button type="submit">Create</button>
                {isSuccess && <span>Success</span>}
                {isError && (
                    <span style={{ color: "red" }}>{error.data.message}</span>
                )}
            </form>
        </div>
    );
}

export default CommentCreate;
