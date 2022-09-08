import axios from "@/utils/request";
const url = '/Admin';
/**
 * @function GetDeviceList 获取设备列表
 * @returns {String} token
 */
 export async function getDeviceList(jsonData: device.devicedata) {
    const result = await axios<defaultType.responseList<device.deviceList[]>>(url, {
        targetAPI: 'GetDeviceList',
        data: jsonData
    })
    return result
}