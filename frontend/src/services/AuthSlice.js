import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { token: null, isAuth: false, id: null, role: null },
    reducers: {
        setCredentials: (state, action) => {
            if (action.payload && action.payload.data) {
                const { token, id, role } = action.payload.data;
                state.token = token;
                state.isAuth = true;
                state.id = id;
                state.role = role;
            } else {
                state.isAuth = false;
            }
        },
        logOut: (state, action) => {
            state.token = null;
            state.isAuth = false;
            state.id = null;
            state.role = null;
        },
    },
});
export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
