import { getToken } from '@/utils/auth/index';
import axios from "@/utils/request";
const url = "/Login";

/**
 * @function AdminPwdLogin
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