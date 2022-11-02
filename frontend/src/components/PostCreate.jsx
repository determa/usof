import React from "react";
import { API } from "../services/ApiService";

function PostCreate() {
    const [createPost, { isSuccess, isError, error }] =
        API.useCreatePostMutation();

    const { data: categories } = API.useFetchAllCategoriesQuery(30);

    const create_handler = async (e) => {
        e.preventDefault();
        await createPost(new FormData(e.target));
    };

    return (
        <div className="block">
            <form className="create_post_form" onSubmit={create_handler}>
                <input name="title" type="text" placeholder="Title" required />
                <select name="categories" size="4" multiple="multiple" required>
                    {categories &&
                        categories.rows.map((category) => {
                            return (
                                <option key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            );
                        })}
                </select>
                <textarea
                    name="content"
                    cols="30"
                    rows="10"
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

export default PostCreate;
