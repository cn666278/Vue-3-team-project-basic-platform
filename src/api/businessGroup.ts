import axios from "@/utils/request";
const url = '/Admin';

/**
 * @function GetBusinessGroupList 获取系统配置
 * @returns {String} token
 */
export async function getBusinessGroupList(jsonData: BusinessGroup.BusinessGroupData) {
    const result = await axios<defaultType.responseList<BusinessGroup.BusinessGroupList[]>>(url, {
        targetAPI: 'GetBusinessGroupList',
        data: jsonData
    })
    return result
}