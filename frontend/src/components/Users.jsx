import React from "react";
import { Link } from "react-router-dom";
import { API } from "../services/ApiService";

function Users() {
    const { data } = API.useFetchAllUsersQuery(30);

    return (
        <>
            <div className="df_fww">
                {data &&
                    data.rows &&
                    data.rows.map((user) => {
                        return (
                            <Link
                                to={`/users/${user.id}`}
                                key={user.id}
                                style={{ width: "80px" }}
                                className="block post__fl_aic jc_c"
                            >
                                <div className="user__info">
                                    <PrintUser data={user} />
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </>
    );
}

function PrintUser({ data }) {
    return (
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
    );
}

export default Users;
