import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../services/ApiService";
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
        let res = await deleteUser(data);
        if (res.data) navigate("users");
    };

    return (
        <>
            <div className="block post__fl_aic jc_c">
                <div className="user__info user__info_big">
                    {<UserInfo userId={id} />}
                    {role === "ADMIN" ? (
                        <>
                            <button onClick={handleRemove}>Delete</button>
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
