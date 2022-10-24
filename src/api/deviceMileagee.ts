import axios from "@/utils/request";
const url = '/Admin';
/**
 * @function GetDeviceMileageeList 获取设备里程列表
 * @returns {String} token
 */
export async function getDeviceMileageeList(jsonData: deviceMileagee.deviceMileageeData) {
    const result = await axios<deviceMileagee.deviceMileageeList[]>(url, {
        targetAPI: 'GetDeviceMileageeList',
        data: jsonData
    })
    return result
}
