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

/**
 * 返回url参数
 * @param param 
 * @returns 
 */
export const getQueryVariable = (param: string) => {
    // let index = window.location.href.indexOf('?')
    // let query = window.location.href.substring(index);
    // let vars = query.split("=");
    // vars[0] = vars[0].replace('?', '');
    // if(vars[0] == param) return vars[1];
    // return(false);
    let query = window.location.hash.split("?")[1];
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        console.log(pair[1]);
        if(pair[0] == param) return pair[1];
    }
    return(false);
};