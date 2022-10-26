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
 * @function AddDeviceTransmit 添加设备转发
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function addDeviceTransmit(jsonData:  deviceTransmit.deviceTransmitdata) {
    const result = await axios<deviceTransmit.deviceTransmitdata>(url, {
        targetAPI: 'AddDeviceTransmit',
        data: jsonData
    })
    return result
}
/**
 * @function DelDeviceTransmit 删除设备转发
 * @returns {String} token
 */
 export async function delDeviceTransmit(jsonData: {idList:Array<any>}) {
    const result = await axios<defaultType.responseList<deviceTransmit.deviceTransmitList[]>>(url, {
        targetAPI: 'DelDeviceTransmit',
        data: jsonData
    })
    return result
}
/**
 * @function GetSelectDeviceList 获取列表
 * @returns {String} token
 */
 export async function getSelectDeviceList(jsonData: SelectDevice.SelectDevicedata) {
    const result = await axios<defaultType.responseList<SelectDevice.SelectDeviceList[]>>(url, {
        targetAPI: 'GetSelectDeviceList',
        data: jsonData
    })
    return result
}