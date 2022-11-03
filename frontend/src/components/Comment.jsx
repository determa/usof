import React from "react";
import { API } from "../services/ApiService";
import getFormattedDate from "../services/getFormatDate";
import { CommentLikes } from "./Likes";
import UserInfo from "./UserInfo";

function Comments({ postId }) {
    const { data } = API.useFetchAllCommentsQuery(postId);

    return (
        <>
            {data &&
                data.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
        </>
    );
}

function Comment({ comment }) {
    return (
        <div className="block fd_col">
            <div className="post__fl_aic">
                {comment && (
                    <div className="user__info">
                        <UserInfo userId={comment.userId} />
                    </div>
                )}
                <div className="short_info">
                    <p>{comment.content}</p>
                    <div className="df_fww">
                        <CommentLikes comment={comment} />
                    </div>
                    <div className="df jc_sb">
                        <span className="date">
                            {getFormattedDate(comment.createdAt)}
                        </span>
                        <span className="date">
                            status: {comment.status ? "true" : "false"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comments;
