import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GenericErrors} from '../../../types/error';

export interface LoginState {
    user: {
        username: string;
        password: string;
        key: string;
    };
    errors: GenericErrors;
    loginIn: boolean;
}

const initialState: LoginState = {
    user: {
        username: '',
        password: '',
        key: '',
    },
    errors: {},
    loginIn: false,
}

const slice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        initializeLogin: () => initialState,
        updateField: (
            state,
            {payload: {name, value}}: PayloadAction<{ name: keyof LoginState['user']; value: string }>
        ) => {
            state.user[name] = value;
        },
        updateErrors: (state, {payload: errors}: PayloadAction<GenericErrors>) => {
            state.errors = errors;
            state.loginIn = false;
        },
        startLoginIn: (state) => {
            state.loginIn = true;
        },
    }
});

export default slice.reducer;
export const {initializeLogin, updateField, updateErrors, startLoginIn} = slice.actions;

