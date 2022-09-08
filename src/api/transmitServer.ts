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