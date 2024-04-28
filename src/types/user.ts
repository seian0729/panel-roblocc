import axios from 'axios';
import {Decoder, number, object, string} from 'decoders';
import {loadUser,logout} from "../components/App/App.slice";
import {store} from "../state/store";

export interface PublicUser {
    username: string;
    id: string;
    limitacc: number,
    access: string,
    dateExpired: number,
    siginKey: string,
}

export interface User extends PublicUser {
    token: string;
    role: string;
}

export const userDecoder: Decoder<User> = object({
    username: string,
    limitacc: number,
    id: string,
    token: string,
    role: string,
    dateExpired: number,
    siginKey: string,
    access: string,
});

export interface UserSettings extends PublicUser {
    username: string;
    password: string | null;
}

export function loadUserIntoApp(user: User) {
    localStorage.setItem('token', user.token);
    //console.log('token', user.token);
    axios.defaults.headers.Authorization = `Bearer ${user.token}`;
    store.dispatch(loadUser(user));
    //console.log('user', user);
}

export function logoutFromApp() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.Authorization;
    store.dispatch(logout());
}
