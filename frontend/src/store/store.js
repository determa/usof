import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { API } from "../services/ApiService";
import authReducer from "../services/AuthSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    [API.reducerPath]: API.reducer,
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(API.middleware),
    });
};
