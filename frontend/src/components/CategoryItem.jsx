import React from "react";
import { useSelector } from "react-redux";
import { API } from "../services/ApiService";
import "./Styles/Category.css";

const CategoryItem = ({ category }) => {
    let { role } = useSelector((state) => state.auth);

    const [deleteCategory, { error: deleteError }] =
        API.useDeleteCategoryMutation();

    const handleRemove = async (e) => {
        e.stopPropagation();
        if (
            role === "ADMIN" &&
            window.confirm(`Delete category: ${category.title} ${category.id}`)
        )
            await deleteCategory({ id: category.id });
    };

    return (
        <div
            className="block fd_col category__item"
            style={{ width: "90px" }}
            onClick={handleRemove}
        >
            <span style={{ overflowWrap: "anywhere" }}>{category.title}</span>
            <span style={{ overflowWrap: "anywhere" }}>
                {category.description}
            </span>
            <span style={{ color: "red" }}>{deleteError && deleteError}</span>
        </div>
    );
};

export default CategoryItem;
