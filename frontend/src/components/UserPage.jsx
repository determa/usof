import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../services/ApiService";
import getFormattedDate from "../services/getFormatDate";
import "./Styles/Post.css";
import UserInfo from "./UserInfo";

const UserPage = () => {
    const { id } = useParams();
    const { data } = API.useFetchOneUserQuery(id);
    let { role } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [deleteUser, { error: deleteError }] = API.useDeleteUserMutation();

    const handleRemove = async (e) => {
        e.stopPropagation();

        if (role === "ADMIN" && window.confirm(`Are you sure?`)) {
            let res = await deleteUser(data);
            if (res.data) navigate("users");
        }
    };

    return (
        <>
            <div className="block post__fl_aic jc_c">
                <div className="user__info user__info_big">
                    {<UserInfo userId={id} />}
                    {role === "ADMIN" ? (
                        <>
                            {data && (
                                <>
                                    <span className="date">
                                        created:{" "}
                                        {getFormattedDate(data.createdAt)}
                                    </span>
                                    <span className="date">
                                        email: {data.confirm ? "" : "not "}
                                        confirmed
                                    </span>
                                </>
                            )}
                            <div className="df jc_sa App">
                                <button className="btn" onClick={handleRemove}>
                                    Delete
                                </button>
                                <button className="btn">update</button>
                            </div>
                            <span style={{ color: "red" }}>
                                {deleteError && deleteError.data.message}
                            </span>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserPage;
