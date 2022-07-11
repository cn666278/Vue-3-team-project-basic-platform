import Cookies from 'js-cookie';
import type { CookieAttributes } from 'js-cookie';

const TokenKey:string = import.meta.env.VITE_TOKEN_KEY;

export const getToken = <T = string | undefined>():T => {
    return Cookies.get(TokenKey) as unknown as T;
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