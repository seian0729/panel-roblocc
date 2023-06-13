import { Action, configureStore } from '@reduxjs/toolkit';
import login from "../components/Pages/Login/Login.slice";
import app from "../components/App/App.slice";




const middlewareConfiguration = { serializableCheck: false };


export const store = configureStore({
    reducer: {
        app,
        login,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});

export type State  = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
    return () => store.dispatch(action);
}