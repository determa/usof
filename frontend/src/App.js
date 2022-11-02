import React from "react";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import PostContainer from "./components/PostContainer";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import PostPage from "./components/PostPage";
import PostCreate from "./components/PostCreate";
import { useSelector } from "react-redux";
import UserPage from "./components/UserPage";
import Users from "./components/Users";
import Categories from "./components/Categories";
import CategoryCreate from "./components/CategoryCreate";

function App() {
    let { isAuth } = useSelector((state) => state.auth);
    return (
        <div className="App">
            <Header />
            <div className="container">
                <Routes>
                    <Route path="/posts" element={<PostContainer />} />
                    <Route path="/posts/:id" element={<PostPage />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:id" element={<UserPage />} />
                    <Route path="/posts/create" element={<PostCreate />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route
                        path="/categories/create"
                        element={<CategoryCreate />}
                    />
                    <Route
                        path="/login"
                        element={
                            isAuth ? <Navigate to="/posts" /> : <AuthForm />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            isAuth ? <Navigate to="/posts" /> : <AuthForm />
                        }
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/posts" replace />}
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
