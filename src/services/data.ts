import axios from 'axios';
import { Err, Ok, Result } from '@hqoss/monads';
import {GenericErrors, genericErrorsDecoder} from "../types/error";
import settings from '../config/settings';
import { array,guard, object, string, } from 'decoders';
import {User, userDecoder} from "../types/user";
axios.defaults.baseURL = settings.baseApiUrl;
// withCredentials: false
axios.defaults.withCredentials = false;

export async function login(username: string, password: string): Promise<Result<User, GenericErrors>> {
    try {
        const {data} = await axios.post('users/login', {username, password});
        console.log('data', data);
        return Ok(guard(object({user: userDecoder}))(data).user);
    } catch ({response: {data}}) {
        return Err(guard(object({errors: genericErrorsDecoder}))(data).errors);
    }

}
export async function getUser(): Promise<User> {
    const { data } = await axios.get('user');
    return guard(object({ user: userDecoder }))(data).user;
}

export async function getData(){
    const { data } = await axios.get('data/getData')
    return data
}

// deleteData
export async function deleteData(username: string[]){
    const { data } = await axios.post('data/bulkDeleteData', {Usernames: username})
    return data
}