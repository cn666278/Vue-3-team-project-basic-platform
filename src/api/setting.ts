import { getToken } from '@/utils/auth/index';
import axios from "@/utils/request";
const url = "/Login";

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