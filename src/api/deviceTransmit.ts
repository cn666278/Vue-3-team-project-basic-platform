import axios from "@/utils/request";
const url = '/Admin';
/**
 * @function GetDeviceTransmitList 获取列表
 * @returns {String} token
 */
 export async function getDeviceTransmitList(jsonData: deviceTransmit.deviceTransmitdata) {
    const result = await axios<defaultType.responseList<deviceTransmit.deviceTransmitList[]>>(url, {
        targetAPI: 'GetDeviceTransmitList',
        data: jsonData
    })
    return result
}
/**
 * @function DelDeviceTransmit 删除设备转发
 * @returns {String} token
 */
 export async function delDeviceTransmit(jsonData: deviceTransmit.delList) {
    const result = await axios<defaultType.responseList<deviceTransmit.deviceTransmitList[]>>(url, {
        targetAPI: 'DelDeviceTransmit',
        data: jsonData
    })
    return result
}