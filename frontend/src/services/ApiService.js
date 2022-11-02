import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { setCredentials, logOut } from "./AuthSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://127.0.0.1:5000/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
        console.log("sending refresh token");
        const refreshResult = await baseQuery(
            "/auth/refresh",
            api,
            extraOptions
        );
        if (refreshResult.data) {
            api.dispatch(setCredentials({ data: refreshResult.data }));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logOut());
        }
    }
    return result;
};

export const API = createApi({
    reducerPath: "API",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Auth", "User", "Post", "Comment", "Category", "Like"],
    endpoints: (build) => ({
        // auth
        refreshUser: build.query({
            query: () => ({
                url: "/auth/whoami",
            }),
            invalidatesTags: ["User", "Post", "Comment"],
        }),
        loginUser: build.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Post", "Comment", "User"],
        }),
        registerUser: build.mutation({
            query: (data) => ({
                url: `/auth/register`,
                method: "POST",
                body: data,
            }),
        }),
        logoutUser: build.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["Post", "Comment", "User"],
        }),

        // posts
        fetchAllPosts: build.query({
            query: (limit = 10, page = 1) => ({
                url: `/posts`,
                params: {
                    _limit: limit,
                    _page: page,
                },
            }),
            providesTags: (result) => [{ type: "Post" }],
        }),
        fetchOnePost: build.query({
            query: (id) => ({
                url: `/posts/${id}`,
            }),
            providesTags: (result) => [{ type: "Post" }],
        }),
        createPost: build.mutation({
            query: (post) => ({
                url: `/posts`,
                method: "POST",
                // headers: { "Content-Type": "application/json" },
                body: post,
            }),
            invalidatesTags: ["Post"],
        }),
        updatePost: build.mutation({
            query: ({ id, content, categories }) => ({
                url: `/posts/${id}`,
                method: "PATCH",
                body: { content, categories },
            }),
            invalidatesTags: ["Post"],
        }),
        deletePost: build.mutation({
            query: (post) => ({
                url: `/posts/${post.id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Post"],
        }),

        // users
        fetchAllUsers: build.query({
            query: (limit = 10, page = 1) => ({
                url: `/users`,
                params: {
                    _limit: limit,
                    _page: page,
                },
            }),
            providesTags: (result) => [{ type: "User" }],
        }),
        fetchOneUser: build.query({
            query: (id) => ({
                url: `/users/${id}`,
            }),
            providesTags: (result) => [{ type: "User" }],
        }),
        deleteUser: build.mutation({
            query: (post) => ({
                url: `/users/${post.id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

        //comments
        fetchAllComments: build.query({
            query: (postId) => ({
                url: `/posts/${postId}/comments`,
            }),
            providesTags: ["Comment"],
        }),
        fetchOneComment: build.query({
            query: (id) => ({
                url: `/comments/${id}`,
            }),
            // providesTags: (result) => [{ type: "User" }],
        }),
        createComment: build.mutation({
            query: (data) => ({
                url: `/posts/${data.postId}/comments`,
                method: "POST",
                body: data.content,
            }),
            invalidatesTags: ["Comment"],
        }),

        // categories
        fetchAllCategories: build.query({
            query: (limit = 10, page = 1) => ({
                url: `/categories`,
                params: {
                    _limit: limit,
                    _page: page,
                },
            }),
            providesTags: (result) => [{ type: "Category" }],
        }),
        fetchOneCategory: build.query({
            query: (id) => ({
                url: `/categories/${id}`,
            }),
            providesTags: (result) => [{ type: "Category" }],
        }),
        createCategory: build.mutation({
            query: (data) => ({
                url: `/categories`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),
        updateCategory: build.mutation({
            query: ({ id, content }) => ({
                url: `/categories/${id}`,
                method: "PATCH",
                body: { content },
            }),
            invalidatesTags: ["Category"],
        }),
        deleteCategory: build.mutation({
            query: (data) => ({
                url: `/categories/${data.id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

        // postLikes
        getPostLikes: build.query({
            query: (id) => ({
                url: `/posts/${id}/like`,
            }),
            providesTags: (result) => [{ type: "Like" }],
        }),
        addPostLike: build.mutation({
            query: ({ id, type }) => ({
                url: `/posts/${id}/like`,
                method: "POST",
                body: { type: type },
            }),
            invalidatesTags: ["Like", "User"],
        }),
        deletePostLike: build.mutation({
            query: ({ data }) => ({
                url: `/posts/${data.id}/like`,
                method: "DELETE",
            }),
            invalidatesTags: ["Like", "User"],
        }),
    }),
});
