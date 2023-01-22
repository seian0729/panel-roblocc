import axios from 'axios';
import { Decoder, nullable, object, string } from 'decoders';
import {loadUser,logout} from "../compoments/App/App.slice";
import {store} from "../state/store";

export interface PublicUser {
    username: string;
    id: string;
}

export interface User extends PublicUser {
    token: string;
}

export const userDecoder: Decoder<User> = object({
    username: string,
    id: string,
    token: string,
});

export interface UserSettings extends PublicUser {
    username: string;
    password: string | null;
}

export function loadUserIntoApp(user: User) {
    localStorage.setItem('token', user.token);
    console.log('token', user.token);
    axios.defaults.headers.Authorization = `Token ${user.token}`;
    store.dispatch(loadUser(user));
    console.log('user', user);
}

export function logoutFromApp() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.Authorization;
    store.dispatch(logout());
}
