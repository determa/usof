import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API } from "../services/ApiService";
import CategoryItem from "./CategoryItem";
import "./Styles/Post.css";

const Categories = () => {
    let { role } = useSelector((state) => state.auth);
    const {
        data: categories,
        isLoading,
        error,
    } = API.useFetchAllCategoriesQuery(30);
    return (
        <>
            {role === "ADMIN" ? (
                <div className="post__create">
                    <Link to="/categories/create" className="link">
                        <p>Add category</p>
                    </Link>
                </div>
            ) : (
                <></>
            )}
            <div className="df_fww">
                {isLoading && <h1>Loading...</h1>}
                {error && <h1>{error.data.message}</h1>}
                {categories &&
                    categories.rows.map((category) => (
                        <CategoryItem key={category.id} category={category} />
                    ))}
            </div>
        </>
    );
};

export default Categories;
