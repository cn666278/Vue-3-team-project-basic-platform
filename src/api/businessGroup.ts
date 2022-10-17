import axios from "@/utils/request";
const url = '/Admin';

/**
 * @function GetBusinessGroupList 获取业务分组
 * @returns {String} token
 */
export async function getBusinessGroupList(jsonData: BusinessGroup.BusinessGroupData) {
    const result = await axios<defaultType.responseList<BusinessGroup.BusinessGroupList[]>>(url, {
        targetAPI: 'GetBusinessGroupList',
        data: jsonData
    })
    return result
}
/**
 * @function AddBusinessGroup 添加业务分组信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function addBusinessGroup(jsonData: BusinessGroup.BusinessGroupData) {
    const result = await axios<BusinessGroup.BusinessGroupData>(url, {
        targetAPI: 'AddBusinessGroup',
        data: jsonData
    })
    return result
}
/**
 * @function GetBusinessGroupInfo 获取业务分组信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function getBusinessGroupInfo(jsonData: string) {
    const result = await axios<BusinessGroup.BusinessGroupList>(url, {
        targetAPI: 'GetBusinessGroupInfo',
        data: jsonData
    })
    return result
}
/**
 * @function UpdateBusinessGroup 修改业务分组信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function UpdateBusinessGroup(jsonData: BusinessGroup.BusinessGroupData) {
    const result = await axios<BusinessGroup.BusinessGroupData>(url, {
        targetAPI: 'UpdateBusinessGroup',
        data: jsonData
    })
    return result
}
/**
 * @function GetBusinessGroupBindRole 获取业务分组关联角色
 * @returns {String} token
 */
export async function getBusinessGroupBindRole(jsonData: string | undefined) {
    const result = await axios<defaultType.responseList<BusinessGroup.BusinessGroupRoleList[]>>(url, {
        targetAPI: 'GetBusinessGroupBindRole',
        data: jsonData
    })
    return result
}
/**
 * @function SetBusinessGroupBindRole 设置业务分组关联角色
 * @returns {String} token
 */
export async function setBusinessGroupBindRole(jsonData: BusinessGroup.BusinessGroupRoleData) {
    const result = await axios<defaultType.responseList<BusinessGroup.BusinessGroupRoleList[]>>(url, {
        targetAPI: 'SetBusinessGroupBindRole',
        data: jsonData
    })
    return result
}