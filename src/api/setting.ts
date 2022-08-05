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

interface menuListRequest {
    name?: string;
    title?: string;
    pid?: string;
    isEnable?: boolean;
    needAuth?:boolean;
    currentPage: number;
    pageSize: number;
}
/**
 * @function GetMenuList 获取菜单列表
 * @param jsonData 查询列表字段
 * @returns 
 */
export async function getMenusList(jsonData: menuListRequest) {
    const result = await axios<defaultType.responseList<admin.menuList[]>>('/Admin', {
        targetAPI: 'GetMenuList',
        data: jsonData
    })
    return result
}