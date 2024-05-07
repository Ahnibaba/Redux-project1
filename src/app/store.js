import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "../features/api/apiSlice";
import usersReducer from "../features/users/usersSlice"
import { getDefaultOptions } from "date-fns";

export const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
       users: usersReducer
    },
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware().concat(apiSlice.middleware)
});