import { getToken } from '@/utils/auth/index';
import axios from "@/utils/request";
const url = "/Login";

/**
 * @function AdminPwdLogin 账户密码登录
 * @param jsonData 登录字段
 * @returns {String} token
 */
export async function loginRequest(jsonData: login.loginRequestType) {
    const result = await axios<Auth.Token>(url, {
        targetAPI: 'AdminPwdLogin',
        data: jsonData
    })
    return result
}

export async function useInfoRequest() {
    return await axios<Auth.UserInfo>(url, {
        targetAPI: 'GetSession',
    })
}