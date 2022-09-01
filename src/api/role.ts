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