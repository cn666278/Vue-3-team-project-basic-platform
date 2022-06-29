import Cookies from 'js-cookie';
import type { CookieAttributes } from 'js-cookie';
import axios from '@/utils/request';

const TokenKey:string = import.meta.env.VITE_TOKEN_KEY;

export const getToken = ():string | undefined => {
    return Cookies.get(TokenKey);
}

export const setToken = (data: Auth.Token, option?:CookieAttributes):void => {
    let { token } = data;
    Cookies.set(TokenKey, token as string, option);
}

export const removeToken = ():void => {
    Cookies.remove(TokenKey);
}

export const getUserInfo = async (token: string) => {

}