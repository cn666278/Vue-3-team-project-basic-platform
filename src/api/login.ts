import { getToken } from '@/utils/auth/index';
import axios from "@/utils/request";
const url = "/Login";

/**
 * @function AdminPwdLogin
 * @param jsonData 登录字段
 * @returns {String} token
 */
// export function login(
//     jsonData: login.loginRequestType
// ): Promise<login.loginResponseType> {
//     return axios(url, {
//         targetAPI: "AdminPwdLogin",
//         data: jsonData,
//     });
// }
export async function loginRequest(jsonData: login.loginRequestType):Promise<Auth.Token> {
    const result:login.loginResponseType = await axios(url, {
        targetAPI: 'AdminPwdLogin',
        data: jsonData,
    })
    return result.Data
}

export async function getSession():Promise<Auth.UserInfo> {
    const result:Auth.UserInfo = await axios(url, {
        targetAPI:'GetSession',
        token: getToken()
    })
    return result
}