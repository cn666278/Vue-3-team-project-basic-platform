import CryptoJS from 'crypto-js';

export function MD5Encrypt(value: string):string {
    let md5 = CryptoJS.MD5(value).toString();
    return md5
}