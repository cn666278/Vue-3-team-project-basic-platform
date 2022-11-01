import axios from "@/utils/request";
const url = '/Admin';
/**
 * @function GetTransmitServerList 获取转发服务器列表
 * @returns {String} token
 */
 export async function getTransmitServerList(jsonData: transmitServer.transmitServerdata) {
    const result = await axios<defaultType.responseList<transmitServer.transmitServerList[]>>(url, {
        targetAPI: 'GetTransmitServerList',
        data: jsonData
    })
    return result
}
/**
 * @function AddTransmitServer 添加转发服务器
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function addTransmitServer(jsonData:  transmitServer.transmitServerdata) {
    const result = await axios<transmitServer.transmitServerdata>(url, {
        targetAPI: 'AddTransmitServer',
        data: jsonData
    })
    return result
}
/**
 * @function GetTransmitServerInfo 获取转发服务器信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function getTransmitServerInfo(jsonData:  string) {
    const result = await axios<transmitServer.transmitServerList>(url, {
        targetAPI: 'GetTransmitServerInfo',
        data: jsonData
    })
    return result
}
/**
 * @function UpdateTransmitServer 修改转发服务器信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function UpdateTransmitServer(jsonData:  transmitServer.transmitServerdata) {
    const result = await axios<transmitServer.transmitServerdata>(url, {
        targetAPI: 'UpdateTransmitServer',
        data: jsonData
    })
    return result
}
/**
 * @function DeleteTransmitServer 删除
 * @returns {String} token
 */
 export async function deleteTransmitServer(jsonData: {id:string}) {
    const result = await axios(url, {
        targetAPI: 'DeleteTransmitServer',
        data: jsonData
    })
    return result
}

/**
 * @function SetTransmitServerIsEnable 禁用或启用
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function setTransmitServerIsEnable(jsonData: object) {
    const result = await axios(url, {
        targetAPI: 'SetTransmitServerIsEnable',
        data: jsonData
    })
    return result
}