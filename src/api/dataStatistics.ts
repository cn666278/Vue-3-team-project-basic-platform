import axios from "@/utils/request";
const url = '/Admin';
/**
 * @function GetAdminStatistics 获取设备里程列表
 * @returns {String} token
 */
export async function getAdminStatistics() {
    const result = await axios<dataStatistics.dataStatisticsList[]>(url, {
        targetAPI: 'GetAdminStatistics',
    })
    return result
}
