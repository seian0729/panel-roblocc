import axios from 'axios';
import { Err, Ok, Result } from '@hqoss/monads';
import {GenericErrors, genericErrorsDecoder} from "../types/error";
import settings from '../config/settings';
import { guard, object, } from 'decoders';
import {User, userDecoder} from "../types/user";
axios.defaults.baseURL = settings.baseApiUrl;

export async function login(username: string, password: string): Promise<Result<User, GenericErrors>> {
    try {
        const {data} = await axios.post('users/login', {username, password});
        //console.log('data', data);
        return Ok(guard(object({user: userDecoder}))(data).user);
    } catch ({response: {data}}) {
        return Err(guard(object({errors: genericErrorsDecoder}))(data).errors);
    }

}
export async function getUser(): Promise<User> {
    const { data } = await axios.get('user');
    return guard(object({ user: userDecoder }))(data).user;
}

export async function getData(gameid: any){
    const { data } = await axios.get(gameid == null ? 'data/getData' : "data/getData?gameId="+gameid, )
    return data
}


// deleteData
export async function deleteData(username: string[]){
    const { data } = await axios.post('data/bulkDeleteData', {Usernames: username})
    return data
}

// seller nhi - send dia
export async function sendDiamond(uid: number,username: string, amount: number){
    console.log(uid, username, amount)

    const { data } = await axios.post('Petx/createData', {Uid: uid, UserReceive: username, Diamonds: Number(amount)})
    return data

}

// seller nhi - order history

export async function getOrder(){
    const { data } = await axios.get('Petx/getOrder')
    return data
}

// get rate

export async function getRate(){
    const { data } = await axios.get('Petx/getRate')
    return data
}