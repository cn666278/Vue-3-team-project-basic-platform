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