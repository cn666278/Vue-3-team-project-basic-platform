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
export async function login(jsonData: login.loginRequestType):Promise<string | null> {
    const result:login.loginResponseType = await axios(url, {
        targetAPI: 'AdminPwdLogin',
        data: jsonData,
    })
    return result.Data?.token
}