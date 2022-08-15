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

/**
 * @function GetCompetenceList 获取接口列表
 * @param jsonData 查询列表字段
 * @returns 
 */
 export async function getCompetenceList(jsonData: admin.competenceListRequest) {
    const result = await axios<defaultType.responseList<admin.competenceList[]>>(url, {
        targetAPI: 'GetCompetenceList',
        data: jsonData
    })
    return result
}

/**
 * @function GetCompetenceControllerList 获取控制器集合
 * @returns 
 */
export async function getCompetenceControllerList() {
    const result = await axios<string[]>(url, {
        targetAPI: 'GetCompetenceControllerList',
    })
    return result
}

/**
 * @function GetCompetenceInfo 获取接口详情
 * @param jsonData 获取接口Id
 * @returns 
 */
 export async function getCompetenceInfo(jsonData: string) {
    const result = await axios<admin.competenceList>(url, {
        targetAPI: 'GetCompetenceInfo',
        data: jsonData
    })
    return result
}

/**
 * @function AddCompetence 添加接口
 * @param jsonData 添加接口字段
 * @returns 
 */
 export async function addCompetence(jsonData: admin.competenceList) {
    const result = await axios(url, {
        targetAPI: 'AddCompetence',
        data: jsonData
    })
    return result
}

/**
 * @function UpdateCompetence 修改接口
 * @param jsonData 修改接口字段
 * @returns 
 */
export async function updateCompetence(jsonData: admin.competenceList) {
    const result = await axios(url, {
        targetAPI: 'UpdateCompetence',
        data: jsonData
    })
    return result
}