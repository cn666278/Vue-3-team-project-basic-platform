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
 * @function AddDevice 添加设备信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function addDevice(jsonData: device.deviceData) {
    const result = await axios<device.deviceData>(url, {
        targetAPI: 'AddDevice',
        data: jsonData
    })
    return result
}
/**
 * @function GetDeviceInfo 获取设备信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function getDeviceInfo(jsonData: string) {
    const result = await axios<device.deviceList>(url, {
        targetAPI: 'GetDeviceInfo',
        data: jsonData
    })
    return result
}
/**
 * @function UpdateDevice 修改设备信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function UpdateDevice(jsonData: device.deviceData) {
    const result = await axios<device.deviceData>(url, {
        targetAPI: 'UpdateDevice',
        data: jsonData
    })
    return result
}

/**
 * @function SetDeviceIsEnable 设置设备启用状态
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function setDeviceIsEnable(jsonData: device.deviceType) {
    const result = await axios<device.deviceList>(url, {
        targetAPI: 'SetDeviceIsEnable',
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