import React from "react";
import "./Styles/AuthForm.css";
import { Link } from "react-router-dom";
import { API } from "../services/ApiService";
import { useLocation } from "react-router-dom";
import { setCredentials } from "../services/AuthSlice";
import { useDispatch } from "react-redux";

const AuthForm = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const isLogin = location.pathname === "/login";

    const [loginUser, { error: loginError }] = API.useLoginUserMutation();
    const [registerUser, { error: registerError }] =
        API.useRegisterUserMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            let res = await loginUser(new FormData(e.target));
            dispatch(setCredentials(res));
        } else {
            await registerUser(new FormData(e.target));
        }
    };

    return (
        <div className="auth">
            <form className="login-box" onSubmit={handleSubmit}>
                <div className="input-section">
                    <input
                        className="input-area"
                        type="text"
                        name="login"
                        placeholder="Login"
                        required
                    />
                </div>
                <div className="input-section">
                    <input
                        className="input-area"
                        type="text"
                        name="email"
                        placeholder="mail@gmail.com"
                        required
                    />
                </div>
                <div className="input-section">
                    <input
                        className="input-area"
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                </div>
                {!isLogin ? (
                    <div className="input-section">
                        <input
                            className="input-area"
                            type="password"
                            name="conf_password"
                            placeholder="Password confirm"
                            required
                        />
                    </div>
                ) : (
                    ""
                )}
                <button className="btn" id="login-btn">
                    {isLogin ? "Login" : "Register"}
                </button>
                <div className="question-box">
                    <Link to="/forgot" className="reg-btn">
                        Forgot password
                    </Link>
                </div>
                <div className="question-box">
                    <p className="question">
                        {isLogin ? "Not a memeber?" : "New user?"}
                    </p>
                    <Link
                        to={isLogin ? "/register" : "/login"}
                        className="reg-btn"
                    >
                        {isLogin ? "Register" : "Login"}
                    </Link>
                </div>

                {isLogin
                    ? loginError && (
                          <div id="error-box">
                              {loginError.data.message &&
                                  loginError.data.message}
                          </div>
                      )
                    : registerError && (
                          <div id="error-box">
                              {registerError.data.message &&
                                  registerError.data.message}
                          </div>
                      )}
            </form>
        </div>
    );
};

export default AuthForm;
