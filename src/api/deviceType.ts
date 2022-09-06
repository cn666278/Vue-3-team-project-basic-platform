import axios from "@/utils/request";
const url = '/Admin';

/**
 * @function GetDeviceTypeList 获取设备信息
 * @returns {String} token
 */
 export async function getDeviceTypeList(jsonData: deviceType.deviceTypedata) {
    const result = await axios<defaultType.responseList<deviceType.deviceTypeList[]>>(url, {
        targetAPI: 'GetDeviceTypeList',
        data: jsonData
    })
    return result
}

/**
 * @function AddDeviceType 添加菜单信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function addDeviceType(jsonData:  deviceType.deviceTypedata) {
    const result = await axios<deviceType.deviceTypedata>(url, {
        targetAPI: 'AddDeviceType',
        data: jsonData
    })
    return result
}
/**
 * @function GetDeviceTypeInfo 获取菜单信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function getDeviceTypeInfo(jsonData:  string) {
    const result = await axios<deviceType.deviceTypeList>(url, {
        targetAPI: 'GetDeviceTypeInfo',
        data: jsonData
    })
    return result
}
/**
 * @function UpdateDeviceType 修改菜单信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function UpdateDeviceType(jsonData:  deviceType.deviceTypedata) {
    const result = await axios<deviceType.deviceTypedata>(url, {
        targetAPI: 'UpdateDeviceType',
        data: jsonData
    })
    return result
}