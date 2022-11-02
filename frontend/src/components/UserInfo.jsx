import React from "react";
import { API } from "../services/ApiService";
import "./Styles/User.css";

const UserInfo = ({ userId }) => {
    const { data } = API.useFetchOneUserQuery(userId);

    return (
        <>
            {data && (
                <>
                    <img
                        alt="img"
                        className="user__img"
                        src={`http://localhost:5000/${data.picture}`}
                    ></img>
                    <span>{data.login}</span>
                    <span>{data.rating}&#9733;</span>
                    <span className="user__info_role">{data.role}</span>
                </>
            )}
        </>
    );
};
export default UserInfo;
