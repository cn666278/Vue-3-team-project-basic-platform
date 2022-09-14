import axios from "@/utils/request";
const url = '/Admin';
/**
 * @function GetDeviceList 获取设备列表
 * @returns {String} token
 */
 export async function getDeviceList(jsonData: device.deviceData) {
    const result = await axios<defaultType.responseList<device.deviceList[]>>(url, {
        targetAPI: 'GetDeviceList',
        data: jsonData
    })
    return result
}

/**
 * @function GetDeviceMapIndex 获取设备监控页面数据
 * @returns {unAuth.mapTreeList}
 */
export async function getDeviceMapIndex() {
    const result = await axios<unAuth.mapTreeList>('/UnAuth', {
        targetAPI: 'GetDeviceMapIndex',
    });
    return result
}

/**
 * @function GetBusinessMapIndex 获取业务监控页面数据
 * @returns {unAuth.mapTreeList}
 */
export async function getBusinessMapIndex() {
    const result = await axios<unAuth.mapTreeList>('/UnAuth', {
        targetAPI: 'GetBusinessMapIndex',
    });
    return result
}