import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { companiesApi } from "./apis/companiesApi";
import { staffApi } from "./apis/staffApi";
import { templatesApi } from "./apis/templatesApi";
import { userReducer } from "./reducers/user";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      [authApi.reducerPath]: authApi.reducer,
      [staffApi.reducerPath]: staffApi.reducer,
      [templatesApi.reducerPath]: templatesApi.reducer,
      [companiesApi.reducerPath]: companiesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        staffApi.middleware,
        templatesApi.middleware,
        companiesApi.middleware,
      ),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
