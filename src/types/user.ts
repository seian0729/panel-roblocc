import axios from 'axios';
import { Decoder, nullable, object, string } from 'decoders';

export interface PublicUser {
    username: string;
}

export interface User extends PublicUser {
    token: string;
}

export const userDecoder: Decoder<User> = object({
    username: string,
    token: string,
});

export interface UserSettings extends PublicUser {
    username: string;
    password: string | null;
}
