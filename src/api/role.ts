import axios from "@/utils/request";
const url = '/Admin';

/**
 * @function GetMapList 获取角色列表
 * @param jsonData 查询列表字段
 * @returns 
 */
export async function getRoleList(jsonData: defaultType.requestList) {
    const result = await axios<defaultType.responseList<role.roleList[]>>(url, {
        targetAPI: 'GetRoleList',
        data: jsonData
    })
    return result
}
/**
 * @function AddRole 添加角色信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function addRole(jsonData: role.roleData) {
    const result = await axios<role.roleData>(url, {
        targetAPI: 'AddRole',
        data: jsonData
    })
    return result
}
/**
 * @function GetRoleInfo 获取角色信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function getRoleInfo(jsonData: string) {
    const result = await axios<role.roleList>(url, {
        targetAPI: 'GetRoleInfo',
        data: jsonData
    })
    return result
}
/**
 * @function UpdateRole 修改角色信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function updateRole(jsonData: role.roleData) {
    const result = await axios<role.roleData>(url, {
        targetAPI: 'UpdateRole',
        data: jsonData
    })
    return result
}
/**
 * @function GetRoleBindMenu 获取角色分配菜单信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function getRoleBindMenu(jsonData: string | undefined) {
    const result = await axios<role.roleList>(url, {
        targetAPI: 'GetRoleBindMenu',
        data: jsonData
    })
    return result
}
/**
 * @function SetRoleBindMenu 设置角色分配菜单
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function setRoleBindMenu(jsonData: role.roleMenuData) {
    const result = await axios<role.roleList>(url, {
        targetAPI: 'SetRoleBindMenu',
        data: jsonData
    })
    return result
}
/**
 * @function GetRoleBindCompetence 获取角色分配接口信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function getRoleBindCompetence(jsonData: string | undefined) {
    const result = await axios<role.roleList>(url, {
        targetAPI: 'GetRoleBindCompetence',
        data: jsonData
    })
    return result
}
/**
 * @function SetRoleBindCompetence 设置角色分配接口
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function setRoleBindCompetence(jsonData: role.competenceIdList) {
    const result = await axios<role.roleList>(url, {
        targetAPI: 'SetRoleBindCompetence',
        data: jsonData
    })
    return result
}