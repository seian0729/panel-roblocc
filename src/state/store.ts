import { Action, configureStore } from '@reduxjs/toolkit';
import login from "../compoments/Pages/Login/Login.slice";





const middlewareConfiguration = { serializableCheck: false };


export const store = configureStore({
    reducer: {
        login,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});

export type RootState = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
    return () => store.dispatch(action);
}