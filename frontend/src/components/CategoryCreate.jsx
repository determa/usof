import React from "react";
import { API } from "../services/ApiService";

function CategoryCreate() {
    const [createCategory, { isSuccess, isError, error }] =
        API.useCreateCategoryMutation();

    const create_handler = async (e) => {
        e.preventDefault();
        await createCategory(new FormData(e.target));
    };

    return (
        <div className="block">
            <form className="create_post_form" onSubmit={create_handler}>
                <input name="title" type="text" placeholder="Title" required />
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Content"
                    required
                ></textarea>
                <button type="submit">Create</button>
                {isSuccess && <span>Success</span>}
                {isError && (
                    <span style={{ color: "red" }}>{error.data.message}</span>
                )}
            </form>
        </div>
    );
}

export default CategoryCreate;
