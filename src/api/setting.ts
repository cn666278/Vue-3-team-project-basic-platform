import axios from "@/utils/request";
const url = "/Admin";

interface menuTree {
    id: string;
    title: string;
    icon: string;
    isSelect: boolean;
    hidden: boolean;
    children: menuTree[]
}
/**
 * @function getMenusTree 获取树形菜单(与Login的GetMenusTree不同)
 * @returns 
 */
export async function  getMenusTree() {
    const result = await axios<menuTree[]>(url, {
        targetAPI: 'GetMenusTree'
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
    const result = await axios<defaultType.responseList<admin.menuList[]>>(url, {
        targetAPI: 'GetMenuList',
        data: jsonData
    })
    return result
}

interface menuAddEdit {
    id?: string;
    pid: string;
    title: string;
    url: string;
    webComponent: string;
    icon?: string;
    isHidden?: boolean;
    needAuth?: boolean;
}
/**
 * @function AddMenu 添加菜单
 * @param jsonData 添加菜单字段
 * @returns 
 */
export async function addMenu(jsonData: menuAddEdit) {
    const result = await axios<menuAddEdit>(url, {
        targetAPI: 'AddMenu',
        data: jsonData
    })
    return result
}
/**
 * @function UpdateMenu 修改菜单
 * @param jsonData 修改菜单字段
 * @returns 
 */
export async function updateMenu(jsonData: menuAddEdit) {
    const result = await axios<menuAddEdit>(url, {
        targetAPI: 'UpdateMenu',
        data: jsonData
    })
    return result
}
/**
 * @function GetMenuInfo 获取菜单详情
 * @param jsonData 获取菜单Id
 * @returns 
 */
export async function getMenuInfo(jsonData: string) {
    const result = await axios<menuAddEdit>(url, {
        targetAPI: 'GetMenuInfo',
        data: jsonData
    })
    return result
}