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

/**
 * @function GetSession 获取用户详情
 * @returns 
 */
export async function useInfoRequest() {
    return await axios<Auth.UserInfo>(url, {
        targetAPI: 'GetSession',
    })
}

/**
 * @function GetMenusTree
 * @param jsonData 搜索字段
 * @returns {String} token
 */
 export async function getMenusTree(jsonData?: string) {
    const result = await axios<defaultType.responseDefaultType<AuthRoute.Route[]>>(url, {
        targetAPI: 'GetMenusTree',
        data: jsonData
    })
    return result
}

interface routeMenuNowMeta {
    title: string;
    hidden: boolean;
    icon: string;
}
interface routeMenuNow {
    name: string;
    url: string;
    meta: routeMenuNowMeta;
    children: routeMenuNow[];
    component: string;
}
/**
 * @function GetMenusTreeNew 新路由菜单接口
 * @param jsonData 搜索字段
 * @returns {String} token
 */
 export async function getMenusTreeNew() {
    const result = await axios<routeMenuNow[]>(url, {
        targetAPI: 'GetMenusTreeNew',
    })
    return result
}

/**
 * @function GetEnumType 获取枚举数组--键值格式
 * @param jsonData 获取接口Id
 * @returns 
 */
 export async function getEnumType(jsonData: string) {
    const result = await axios<login.enumType[]>(url, {
        targetAPI: 'GetEnumType',
        data: jsonData
    })
    return result
}