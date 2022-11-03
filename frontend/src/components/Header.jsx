import React from "react";
import "./Styles/Header.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../services/ApiService";
import { logOut } from "../services/AuthSlice";

const Header = () => {
    API.useRefreshUserQuery();
    let { isAuth, id } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [logoutUser] = API.useLogoutUserMutation();
    const logoutFunc = async (e) => {
        e.stopPropagation();
        await logoutUser();
        dispatch(logOut());
    };
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link className="logo" to="/posts">
                            usoff
                        </Link>
                    </li>
                    <li>
                        <Link to="/posts">Posts Page</Link>
                    </li>
                    <li>
                        <Link to="/users">Users Page</Link>
                    </li>
                    {isAuth ? (
                        <li>
                            <Link to={`/users/${id}`}>Profile</Link>
                        </li>
                    ) : (
                        <li></li>
                    )}
                    <li>
                        <Link to={`/categories`}>Categories</Link>
                    </li>
                    {isAuth ? (
                        <li className="logout" onClick={logoutFunc}>
                            <Link>Logout</Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login">Auth Page</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
