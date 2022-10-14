import axios from "@/utils/request";
const url = '/Config';

/**
 * @function GetSysConfig 获取系统配置
 * @returns {String} token
 */
 export async function getSysConfig() {
    const result = await axios<config.sysConfig>(url, {
        targetAPI: 'GetSysConfig',
    })
    return result
}

/**
 * @function SetSysConfig 设置系统配置
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function setSysConfig(jsonData: config.sysConfig) {
    const result = await axios<config.sysConfig>(url, {
        targetAPI: 'SetSysConfig',
        data: jsonData
    })
    return result
}
/**
 * @function GetDeviceConfig 获取设备配置
 * @returns {String} token
 */
 export async function getDeviceConfig() {
    const result = await axios<config.deviceConfig>(url, {
        targetAPI: 'GetDeviceConfig',
    })
    return result
}

/**
 * @function SetDeviceConfig 设置设备配置
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function setDeviceConfig(jsonData: config.deviceConfig) {
    const result = await axios<config.deviceConfig>(url, {
        targetAPI: 'SetDeviceConfig',
        data: jsonData
    })
    return result
}